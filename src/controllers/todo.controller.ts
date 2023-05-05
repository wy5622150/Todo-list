// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';
import {Geocoder} from '../services';

// 分组计数接口，用于返回值
interface BlockCounting {
  [key: string]: [value: number]
}

export class TodoController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
    @inject('services.Geocoder') protected geoService: Geocoder,
  ) {}

  @post('/todos', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Todo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodo',
            exclude: ['id'],
          }),
        },
      },
    })
    todo: Omit<Todo, 'id'>,
    // 修改返回值类型
  ): Promise<any> {
    if (todo.remindAtAddress) {
      const geo = await this.geoService.geocode(todo.remindAtAddress);

      // ignoring because if the service is down, the following section will
      // not be covered
      /* istanbul ignore next */
      if (!geo[0]) {
        // address not found
        throw new HttpErrors.BadRequest(
          `Address not found: ${todo.remindAtAddress}`,
        );
      }
      // Encode the coordinates as "lat,lng" (Google Maps API format). See also
      // https://stackoverflow.com/q/7309121/69868
      // https://gis.stackexchange.com/q/7379
      todo.remindAtGeo = `${geo[0].y},${geo[0].x}`;
    }
    // 每次添加完返回分组后的计数
    // 该逻辑可以单独封装成函数供调用
    const item = await this.todoRepository.create(todo);
    const blockCounting = await this.blockCounting();
    return { todo: item, blockCounting: blockCounting };
  }

  @get('/todos/{id}', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Todo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>,
  ): Promise<Todo> {
    return this.todoRepository.findById(id, filter);
  }

  @get('/todos', {
    responses: {
      '200': {
        description: 'Array of Todo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Todo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Todo) filter?: Filter<Todo>): Promise<Todo[]> {
    return this.todoRepository.find(filter);
  }

  @put('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<void> {
    await this.todoRepository.replaceById(id, todo);
  }

  @patch('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    await this.todoRepository.updateById(id, todo);
  }

  @del('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoRepository.deleteById(id);
  }

  @get('/todos/count', {
    responses: {
      '200': {
        description: 'Todo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  // 返回总备忘内容条数
  async count(@param.where(Todo) where?: Where<Todo>): Promise<any> {
    const res =  this.todoRepository.find();
    let sum = 0;
    (await res).forEach(item => {
      sum++;
    })
    return "count: " + sum;
  }

  @patch('/todos', {
    responses: {
      '200': {
        description: 'Todo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.updateAll(todo, where);
  }

  // 新建endpoint，返回分组计数和总数
  @get('/todos/counts', {
    response: {
      '200': {
        description: "Get Block Counting!"
        content: {
          'application/json': { schema: {} as BlockCounting }
        }
      }
    }
  })

  // 具体逻辑 if-else可改switch-case
  async blockCounting(): Promise<BlockCounting> {
    const target: BlockCounting = {
      sum: 0,
      abstract: 0,
      basic: 0,
      specific: 0
    };
    const todos = await this.todoRepository.find();
    todos.forEach((item) => {
      if ("".match(item.type))
          ""
      else if (item.type.match("A"))
          target.abstract++;
      else if (item.type.match("B"))
          target.basic++;
      else if (item.type.match("C"))
          target.specific++;
      else;      
      target.sum++;
    })
    return target;
  }

  // 新建endpoint，可添加todo项，添加成功返回计数
  @post('/todos/add', {
    responses: {
      '200': {
        description: 'The interface of todo added!',
        content: {
          'application/json': { schema: {} as Todo }
        }
      }
    }
  })
  
  async todoAdded(
    @requestBody({
      content: {
        'application/json': { schema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            desc: {
              type: 'string'
            },
            type: {
              type: 'string',
              enum: ['abstract', 'basic', 'specific']
            }
          }
        }}
      }
    }) todo: Todo
  ): Promise<any> {
    const item = await this.todoRepository.create(todo);
    const blockCounting = await this.blockCounting();
    return { todo: item, blockCounting: blockCounting };
  }
}

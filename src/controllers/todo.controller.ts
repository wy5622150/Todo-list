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
    get, getContentType,
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
import {TypeCountInfo} from "../models";


export class TodoController {
    constructor(
        @repository(TodoRepository)
        public todoRepository: TodoRepository,
        @inject('services.Geocoder') protected geoService: Geocoder,
    ) {
    }


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
        // @ts-ignore
    ): Promise<TypeCountInfo[]> {
        // if (todo.remindAtAddress) {
        //     const geo = await this.geoService.geocode(todo.remindAtAddress);
        //
        //     // ignoring because if the service is down, the following section will
        //     // not be covered
        //     /* istanbul ignore next */
        //     if (!geo[0]) {
        //         // address not found
        //         throw new HttpErrors.BadRequest(
        //             `Address not found: ${todo.remindAtAddress}`,
        //         );
        //     }
        //     // Encode the coordinates as "lat,lng" (Google Maps API format). See also
        //     // https://stackoverflow.com/q/7309121/69868
        //     // https://gis.stackexchange.com/q/7379
        //     todo.remindAtGeo = `${geo[0].y},${geo[0].x}`;
        // }
        await this.todoRepository.create(todo);
        return this.endpoint();
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
    async count(@param.where(Todo) where?: Where<Todo>): Promise<Count> {
        return this.todoRepository.count(where);
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


    @get('/todos/endpoint', {
        responses: {
            '200': {
                description: 'The information of Todos group by type'
            },
        },
    })// @ts-ignore
    async endpoint(): Promise<TypeCountInfo[]> {

        const typeCountInfos: TypeCountInfo[] = [];
        const types = await this.getTypes();
        for (let i = 0; i < types.length; i++) {
            // @ts-ignore
            const typeCountInfo: TypeCountInfo = {};
            const type = {type: null};
            // @ts-ignore
            type.type = types[i];
            // @ts-ignore
            typeCountInfo.type = type.type;
            // @ts-ignore
            const count = await this.todoRepository.count(type);
            typeCountInfo.count = count.count;
            typeCountInfos.push(typeCountInfo);
        }
        return typeCountInfos;
    }

    @get('/todos/getTypes', {
        responses: {
            '200': {
                description: 'The information of Todos-type'
            },
        },
    })// @ts-ignore
    async getTypes(): Promise<string[]> {

        const typeInfos: string[] = [];
        // @ts-ignore
        const todos: Todo[] = await this.todoRepository.find(null);
        for (let i = 0; i < todos.length; i++) {
            const type = todos[i].type;
            // @ts-ignore
            if (!typeInfos.includes(type)) {
                // @ts-ignore
                typeInfos.push(type);
            }
        }
        return typeInfos;
    }


}

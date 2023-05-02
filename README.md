1. 为这个备忘录中的每条备忘内容（entry）增加一个字段‘type’用来标注这一条内容的类型（如：A,B,C, 这个字段类型为字符串）
2. 添加一个endpoint(功能)，可以返回当前所有类型条目的数量（A类型多少个，B类型多少个，要求显示所有的）
3. 每次添加条目时返回2.中的结果，但是返回值需要计算新添条目后的结果。
4. 你有一个星期的时间完成以上任务。
6. 可以对这个项目进行任何你认为可以展现你技能的修改，但是额外内容请基于一个新branch并指向1.2.3.的branch以便区分。
7. 修改完成后请添加一个（或多个）pull request

# @loopback/example-todo

This is the basic tutorial for getting started with Loopback 4!

## Overview

This tutorial demonstrates how to create a basic API for a todo list using
LoopBack 4. You will experience how you can create REST APIs with just
[5 steps](#steps).

![todo-tutorial-overview](https://loopback.io/pages/en/lb4/imgs/todo-overview.png)

## Setup

First, you'll need to install a supported version of Node:

- [Node.js](https://nodejs.org/en/) at v10 or greater

Additionally, this tutorial assumes that you are comfortable with certain
technologies, languages and concepts.

- JavaScript (ES6)
- [REST](http://www.restapitutorial.com/lessons/whatisrest.html)

## Try it out

If you'd like to see the final results of this tutorial as an example
application, follow these steps:


    $ npm i
    $ npm run build
    $ npm start

    Server is running at http://127.0.0.1:3000

## Tests

Run `npm test` from the root folder.


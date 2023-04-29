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

1. 为这个备忘录中的每条备忘内容（entry）增加一个字段‘type’用来标注这一条内容的类型（如：A,B,C, 这个字段类型为字符串）
2. 添加一个endpoint，可以返回当前记录所有类型条目的数量（A类型多少个，B类型多少个，要求显示所有的）
3. 每次添加条目时返回2.要求类似的结果，但是返回值需要是加算上新添条目后的结果

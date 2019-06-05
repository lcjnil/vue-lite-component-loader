# vue-block-lite-component

一个 vue 的 `lite-component` loader，可以在单文件组件中，拆分出子组件，下面给出一个实例：

```vue
<template>
  <div>
    <p>123</p>
    <bonjour :name="{ name: 'world' }"></bonjour>
    <user
      :user="{ name: 'userName' }"
      profile="xxxx"
      @clicked="handleClick"
    ></user>
  </div>
</template>

<lite-component>
    <template name="bonjour" props="['name']">
        <div @click="$emit('test')">
            <p>Hello, {{name}}</p>
            <p class="red">red</p>
        </div>
    </template>

    <template name="user" props="['user', 'profile']">
        <div @click="$emit('clicked')">
            <p>{{user.name}}</p>
            <p>{{profile}}</p>
        </div>
    </template>
</lite-component>

<script>
export default {
    handleClick() {
        console.error("I am clicked");
    }
};
</script>

<style scoped>
p {
    color: blue;
}

.red {
    color: red;
}
</style>

```

支持 scoped css、事件、model 配置。

## 启发

vue 单文件组件挺好用，但是提高了拆分组件的成本。这个库的目的就是降低拆组件的成本，使得一些 `view component` 可以方便的分拆出去。

## 安装以及配置

可以参考 vue 中 [自定义块](https://vue-loader.vuejs.org/guide/custom-blocks.html#custom-blocks)，例如：

```js
{
    module: {
        rules: [
            {
                resourceQuery: /blockType=lite-component/,
                loader: 'vue-block-lite-component'
            }
        ]
    }
}
```

这里配置的 `blockType` 即为块的名字，可以自定义，在示例中为 `lite-component`;

## 使用

`lite-component` 中定义的组件，需要和 vue 一样，使用 template 包裹起来，需要有以下属性：

- `name` 子组件的名字
- `props` 子组件接受的参数，需要为一个 JavaScript 数组。
- `model` 子组件的 model 属性，需要为一个 JavaScript 对象，如：`model="{prop: 'optionId', event: 'change'}`

## 问题与路线

- 目前使用了 `cheerio` 做模块的编译，由于其本身有一定的容错处理，导致模块的语法错误无法被抛出。
- 目前不支持 hot reload。

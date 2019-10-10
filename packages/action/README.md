# `action`

Auto.pro的点击、滑动插件，对安卓版本进行了兼容

## Usage

```
// 加载核心库
import Core from '@auto.pro/core'

// 加载本插件
import Action, {useAction} from '@auto.pro/action'

const core = Core()

// 添加本插件
core.use(Action)

// 获取点击函数
const { cap, click, swipe } = useAction()

click(100, 200)

// 点击后等待一段时间
click(100, 200, [600, 800])

const img = cap()

cap('assets/screenshot.png')

swipe([100, 200], [500, 500])
```

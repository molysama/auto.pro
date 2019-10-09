
import typescript from 'rollup-plugin-typescript'

export default {
    input: 'lib/action.ts',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        typescript()
    ]
}
import uuidjs from 'uuid-js'

describe('webview', () => {

    test('runHtmlFunction param', () => {

        var arr = []

        function run(...value) {
            eval(`arr.push(...${JSON.stringify(value)})`)
            console.log(arr)
            return arr
        }
        expect(run(1, 2, 'ddd', [4, 5, 6])).toEqual([1, 2, 'ddd', [4, 5, 6]])
    })

    test('uuid', () => {
        const uuid = uuidjs.create(4).toString()
        console.log('uuid', uuid)
        expect(uuid).not.toBeUndefined()
    })
})

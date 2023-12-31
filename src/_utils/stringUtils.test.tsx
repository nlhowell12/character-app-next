import { camelString, camelToTitle } from "./stringUtils"

describe('string utils', () => {
    it('should title a camel string', () => {
        const expected = 'This Is Bullshit';
        expect(camelToTitle('thisIsBullshit')).toStrictEqual(expected);
    })
    it('should camel any string', () => {
        const expected = 'thisIsBullshit'
        expect(camelString('This is bullshit')).toStrictEqual(expected);
        expect(camelString('this Is bullshit')).toStrictEqual(expected);
        expect(camelString('This is Bullshit')).toStrictEqual(expected);
        expect(camelString('This Is Bullshit')).toStrictEqual(expected);
    })
})
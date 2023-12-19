import { mockCharacters } from '@/_mockData/characters';
import * as classUtils from './classUtils';

describe('Class Utils', () => {
	const mock0 = mockCharacters[0];
	test('getClassAbilities', () => {
		expect(classUtils.getClassAbilities(mock0).length).toBe(3);
	});
});

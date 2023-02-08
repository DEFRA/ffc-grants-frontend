const { formatAnswers } = require('../../../../app/helpers/score-table-helper');


describe('Score table helper functions', () => {
	test.only('formatAnswers()', () => {
		const answersSample = [
			{
				"key": "Q16a",
				"title": "Current land irrigated",
				"input": [
					{
						"key": null,
						"value": 10
					}
				]
			},
			{
				"key": "Q16b",
				"title": "Future land irrigated",
				"input": [
					{
						"key": null,
						"value": 20
					}
				]
			},
			{
				"key": "Q19",
				"title": "Productivity",
				"input": [
					{
						"key": "Q19-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
			{
				"key": "Q15",
				"title": "Main crop",
				"input": [
					{
						"key": "Q19-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
			{
				"key": "Q20",
				"title": "Water sharing",
				"input": [
					{
						"key": "Q19-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
		];

		const answersSample2 = [
		];


		const result = [
			{
				"key": "Q16a",
				"title": "Current",
				"input": [
					{
						"key": null,
						"value": 10,
					},
				],
			},
			{
				"key": "Q16b",
				"title": "Future",
				"input": [
					{
						"key": null,
						"value": 20,
					},
				],
			},
			{
				"key": "Q19",
				"title": "Productivity",
				"input": [
					{
						"key": "Q19-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
			{
				"key": "Q15",
				"title": "Crops",
				"input": [
					{
						"key": "Q19-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
			{
				"key": "Q20",
				"title": "Other farms",
				"input": [
					{
						"key": "Q19-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
		];


		expect(formatAnswers(answersSample)).toEqual(result);
	});
});

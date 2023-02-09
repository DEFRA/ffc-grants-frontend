const { formatAnswers } = require('../../../../app/helpers/score-table-helper');


describe('Score table helper functions', () => {
	test('formatAnswers(), currently irrigating scenario (YES Scenario)', () => {
		const answersSample1 = [
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
			}
		];

		const answersSample2 = [
			{
				"key": "Q19",
				"title": "Productivity",
				"input": [
					{
						"key": "Q19-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			}
		];

		const answersSample3 = [
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
		];
		const answersSample4 = [
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


		const result1 = [
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
		];

		const result2 = [
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
		];

		const result3 = [
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
		];

		const result4 = [
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


		expect(formatAnswers(answersSample1)).toEqual(result1);
		expect(formatAnswers(answersSample2)).toEqual(result2);
		expect(formatAnswers(answersSample3)).toEqual(result3);
		expect(formatAnswers(answersSample4)).toEqual(result4);
	});

	test('formatAnswers(), NOT currently irrigating scenario (No Scenario)', () => {
		// Not currently irrigating answer
		const answersSample1 = [
			{
				"key": "Q18a",
				"title": "Current irrigation systems",
				"input": [
					{
						"key": "Q18a-A8",
						"value": "Not currently irrigating"
					}
				]
			},
			{
				"key": "Q18b",
				"title": "Future irrigation systems",
				"input": [
					{
						"key": "Q18b-A6",
						"value": "Boom"
					}
				]
			}
		];

		// Number of hectares irrigated is 0
		const answersSample2 = [
			{
				"key": "Q16a",
				"title": "Current land irrigated",
				"input": [
					{
						"key": null,
						"value": 0
					}
				]
			},
			{
				"key": "Q16b",
				"title": "Future land irrigated",
				"input": [
					{
						"key": null,
						"value": 12
					}
				]
			}
		];


		const result1 = [
			{
				"key": "Q18b",
				"title": null,
				"input": [
					{
						"key": "Q18b-A6",
						"value": "Boom"
					}
				],
			},
		];

		const result2 = [
			{
				"key": "Q16b",
				"title": null,
				"input": [
					{
						"key": null,
						"value": 12
					}
				],
			},
		];


		expect(formatAnswers(answersSample1)).toEqual(result1);
		expect(formatAnswers(answersSample2)).toEqual(result2);
	});
});
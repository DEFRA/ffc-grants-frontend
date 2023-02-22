const { formatAnswers } = require('../../../../app/helpers/score-table-helper');


describe('Score table helper functions', () => {
	test('formatAnswers(), currently irrigating scenario (YES Scenario)', () => {
		const answersSample1 = [
			{
				"key": "irrigated-land-a",
				"title": "Current land irrigated",
				"input": [
					{
						"key": null,
						"value": 10
					}
				]
			},
			{
				"key": "irrigated-land-b",
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
				"key": "productivity",
				"title": "Productivity",
				"input": [
					{
						"key": "productivity-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			}
		];

		const answersSample3 = [
			{
				"key": "irrigated-crops",
				"title": "Main crop",
				"input": [
					{
						"key": "productivity-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
		];
		const answersSample4 = [
			{
				"key": "collaboration",
				"title": "Water sharing",
				"input": [
					{
						"key": "productivity-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
		];


		const result1 = [
			{
				"key": "irrigated-land-a",
				"title": "Current",
				"input": [
					{
						"key": null,
						"value": 10,
					},
				],
			},
			{
				"key": "irrigated-land-b",
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
				"key": "productivity",
				"title": "Productivity",
				"input": [
					{
						"key": "productivity-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
		];

		const result3 = [
			{
				"key": "irrigated-crops",
				"title": "Crops",
				"input": [
					{
						"key": "productivity-A1",
						"value": "Introduce or expand high-value crops"
					}
				]
			},
		];

		const result4 = [
			{
				"key": "collaboration",
				"title": "Other farms",
				"input": [
					{
						"key": "productivity-A1",
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
				"key": "irrigation-system-a",
				"title": "Current irrigation systems",
				"input": [
					{
						"key": "irrigation-system-a-A8",
						"value": "Not currently irrigating"
					}
				]
			},
			{
				"key": "irrigation-system-b",
				"title": "Future irrigation systems",
				"input": [
					{
						"key": "irrigation-system-b-A6",
						"value": "Boom"
					}
				]
			}
		];

		// Number of hectares irrigated is 0
		const answersSample2 = [
			{
				"key": "irrigated-land-a",
				"title": "Current land irrigated",
				"input": [
					{
						"key": null,
						"value": 0
					}
				]
			},
			{
				"key": "irrigated-land-b",
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
				"key": "irrigation-system-b",
				"title": null,
				"input": [
					{
						"key": "irrigation-system-b-A6",
						"value": "Boom"
					}
				],
			},
		];

		const result2 = [
			{
				"key": "irrigated-land-b",
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
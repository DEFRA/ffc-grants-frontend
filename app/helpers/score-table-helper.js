const formatAnswers = (answers) => {
	// if it's 2 answers and the value of the first answer is "Not currently irrigating" or 0 hectare
	if (answers.length > 1 && (answers[ 0 ].input[ 0 ].value === "Not currently irrigating" || answers[ 0 ].input[ 0 ].value === 0)) {
		// remove the title of the second answer if it is "Not currently irrigating"
		answers[ 1 ].title = null;
		// remove the first answer if it is "Not currently irrigating" (i.e. empty)
		answers.shift();
	} else {
		// format the answer title if "currently irrigating"
		answers.forEach((answer) => {
			// shorten the answer title as per design
			if (answer.title && answer.title.startsWith('Current')) {
				answer.title = 'Current';
			} else if (answer.title && answer.title.startsWith('Future')) {
				answer.title = 'Future';
			}

			// replace the answer title as per design
			if (answer.title && answer.title === 'Main crop') {
				answer.title = 'Crops';
			}

			if (answer.title && answer.title === 'Water sharing') {
				answer.title = 'Other farms';
			}
		});

	}
	return answers;
};

const tableOrder = [
	{
		key: 'water-source',
		order: 1,
		title: 'Irrigation water source',
		pagesTitle: 'Irrigation source',
		url: 'water-source',
		fundingPriorities: 'Improve the environment <br/> Improving water sustainability',
		yarKey: 'waterSourceCurrent',
	},
	{
		key: 'irrigation-system',
		order: 2,
		title: 'Irrigation system',
		pageTitle: 'Irrigation system',
		fundingPriorities: 'Improve the environment <br/> Improving water sustainability',
		url: 'irrigation-system',
		yarKey: 'irrigationCurrent',
	},
	{
		key: 'irrigated-crops',
		order: 3,
		pageTitle: 'Main crop',
		fundingPriorities: 'Improve productivity',
		url: 'irrigated-crops',
		yarKey: 'irrigatedCrops',
	},
	{
		key: 'irrigated-land',
		order: 4,
		title: 'Irrigated land',
		pageTitle: 'Irrigated land',
		desc: 'Enter figure in hectares (ha)',
		fundingPriorities: 'Improve productivity',
		unit: 'hectares',
		url: 'irrigated-land',
		yarKey: 'irrigatedLandCurrent'
	},
	{
		key: 'productivity',
		order: 5,
		pageTitle: 'Productivity',
		fundingPriorities: 'Improve productivity',
		desc: 'Productivity is about how much is produced relative to inputs (for example, increased yield for the same inputs or the same yield with lower inputs).',
		url: 'productivity',
		yarKey: 'productivity',
	},
	{
		key: 'collaboration',
		order: 6,
		pageTitle: 'Other farms',
		fundingPriorities: 'Improve water sustainability',
		desc: 'If you intend to supply water via a water sharing agreement as a result of this project.',
		url: 'collaboration',
		yarKey: 'collaboration',
	},
];
module.exports = {
	formatAnswers,
	tableOrder,
}
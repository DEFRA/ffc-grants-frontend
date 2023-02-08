const formatAnswers = (answers) => {
	answers.forEach((answer) => {
		// shorten the answer title as per design
		if (answer.title.startsWith('Current')) {
			answer.title = 'Current';
		} else if (answer.title.startsWith('Future')) {
			answer.title = 'Future';
		}

		// replace the answer title as per design
		if (answer.title === 'Main crop') {
			answer.title = 'Crops';
		}

		if (answer.title === 'Water sharing') {
			answer.title = 'Other farms';
		}
	});
	return answers;
};

const tableOrder = [

	{
		key: 'Q17',
		order: 1,
		title: 'Irrigation water source',
		pagesTitle: 'Irrigation source',
		url: 'irrigation-water-source',
		fundingPriorities: 'Improve the environment <br/> Improving water sustainability',
		yarKey: 'waterSourceCurrent',
	},
	{
		key: 'Q18',
		order: 2,
		title: 'Irrigation system',
		pageTitle: 'Irrigation system',
		fundingPriorities: 'Improve the environment <br/> Improving water sustainability',
		url: 'irrigation-system',
		yarKey: 'irrigationCurrent',
	},

	{
		key: 'Q15',
		order: 3,
		pageTitle: 'Main crop',
		fundingPriorities: 'Improve productivity',
		url: 'irrigated-crops',
		yarKey: 'irrigatedCrops',

	},
	{
		key: 'Q16',
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
		key: 'Q19',
		order: 5,
		pageTitle: 'Productivity',
		fundingPriorities: 'Improve productivity',
		desc: 'Productivity is about how much is produced relative to inputs (for example, increased yield for the same inputs or the same yield with lower inputs).',
		url: 'productivity',
		yarKey: 'productivity',
	},
	{
		key: 'Q20',
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

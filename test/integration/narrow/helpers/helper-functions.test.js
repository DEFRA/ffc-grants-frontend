describe('Helper functions', () => {
    const {  isChecked,
        setLabelData,
        getGrantValues,
        isInteger,
        formatUKCurrency,
        findErrorList } = require('../../../../app/helpers/helper-functions')

    test('isChecked()', () => {
        expect(isChecked([ 'Overflow/spillway' ],'Construction of reservoir walls')).toEqual(false)
    })

    test('setLabelData()', () => {
        const data = [ 'Overflow/spillway' ]
        const labelData=  ['Construction of reservoir walls',
        'Overflow/spillway',
        'Synthetic liner',
        'Abstraction point including pump',
        'Fencing for synthetically lined reservoir',
        'Filtration equipment',
        'Irrigation pumps and controls',
        'Pipework to fill the reservoir',
        'Pumphouse',
        'Underground water distribution main and hydrants',
        'Electricity installation for pumphouse',
        'Water meter']
        const result= [{"checked": false, "selected": false, "text": "Construction of reservoir walls", "value": "Construction of reservoir walls"},
        {"checked": true, "selected": false, "text": "Overflow/spillway", "value": "Overflow/spillway"}, 
        {"checked": false, "selected": false, "text": "Synthetic liner", "value": "Synthetic liner"}, {"checked": false, "selected": false, "text": "Abstraction point including pump", "value": "Abstraction point including pump"},
        {"checked": false, "selected": false, "text": "Fencing for synthetically lined reservoir", "value": "Fencing for synthetically lined reservoir"}, {"checked": false, "selected": false, "text": "Filtration equipment", "value": "Filtration equipment"}, 
        {"checked": false, "selected": false, "text": "Irrigation pumps and controls", "value": "Irrigation pumps and controls"}, {"checked": false, "selected": false, "text": "Pipework to fill the reservoir", "value": "Pipework to fill the reservoir"},
        {"checked": false, "selected": false, "text": "Pumphouse", "value": "Pumphouse"}, 
        {"checked": false, "selected": false, "text": "Underground water distribution main and hydrants", "value": "Underground water distribution main and hydrants"},
        {"checked": false, "selected": false, "text": "Electricity installation for pumphouse", "value": "Electricity installation for pumphouse"}, {"checked": false, "selected": false, "text": "Water meter", "value": "Water meter"}]

        expect(setLabelData(data,labelData)).toEqual(result)
    })

    test('getGrantValues()', () => {
        let result ={"calculatedGrant": "0.00", "remainingCost": "0.00"}
        expect(getGrantValues('')).toEqual(result)
    })

    test('formatUKCurrency()', () => {
        expect(formatUKCurrency('')).toEqual('0')
        expect(formatUKCurrency(123456)).toEqual('123,456')
    })
    test('isInteger()', () => {
        expect(isInteger(122.33)).toEqual(false)
        expect(isInteger(123456)).toEqual(true)
    })
    // test('findErrorList()', () => {
    //     const details = {
    //     details: [{
    //         summaryText: 'Who is eligible',
    //         html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>',
    //         label:'radio'
    //     }]
    // }
    //     expect(findErrorList(details,['radio'])).toEqual(false)
    // })
})

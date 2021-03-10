function isChecked(data, option) {
    return !!data && (data.includes(option))
}

function setLabelData(data,labelData) {
    return labelData.map(label => {
        return {
            value: label,
            text: label,
            checked: isChecked(data,label)
        }
    }) 
}

module.exports = { isChecked,setLabelData }

function isChecked(data, option) {
    return !!data && (data.includes(option))
}

function setLabelData(data,Labeldata) {
    return  {
        value: Labeldata,
        text: Labeldata,
        checked: isChecked(data,Labeldata)
    }
}

module.exports = { isChecked,setLabelData }

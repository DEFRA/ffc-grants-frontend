const Joi = require("joi");
const { setYarValue, getYarValue } = require("../helpers/session");
const { setLabelData } = require("../helpers/helper-functions");
const urlPrefix = require("../config/server").urlPrefix;
const gapiService = require("../services/gapi-service");

const viewTemplate = "newpage";
const currentPath = `${urlPrefix}/${viewTemplate}`;
const nextPath = `${urlPrefix}/irrigation-systems`;
const previousPath = `${urlPrefix}/abstraction`;

function createModel(errorList, projectInfrastucture, projectEquipment) {
  console.log('ERROR LIST', errorList)
  return {
    backLink: previousPath,
    formActionLink: currentPath,
    pageTitle: 'Water Source',
    ...(errorList ? { errorList } : {}),
    ...(projectInfrastucture ? {  checkboxesInfrastucture: {
      idPrefix: "projectInfrastucture",
      name: "projectInfrastucture",
      fieldset: {
        legend: {
          text: "What is your main water source?",
          isPageHeading: false,
          classes: "govuk-fieldset__legend--m",
        },
      },
      hint: {
        text: "Select all that apply."
      },
      items: setLabelData(projectInfrastucture, [
        "Winter peak-flow abstraction",
        "Rain water harvesting",
        "Bore hole/aquifer",
      ]),
      ...(errorList ? { errorMessage: { text: errorList[0].text } } : {}),
    }, } : ''),
    ...(projectEquipment || projectEquipment===undefined ? { checkboxesEquipment: {
      idPrefix: "projectEquipment",
      name: "projectEquipment",
      fieldset: {
        legend: {
          text: "What will be the new water source?",
          isPageHeading: false,
          classes: "govuk-fieldset__legend--m",
        },
      },
      hint: {
        text: "Select all that apply."
      },
      items: setLabelData(projectEquipment, [
        "ssd",
        "ABS",
        "Bore hole/aquifer",
      ]),
      ...(errorList ? { errorMessage: { text: null } } : {}),
    }, } : ''),
  };
}

module.exports = [
  {
    method: "GET",
    path: currentPath,
    handler: (request, h) => {
      let projectInfrastucture =
        getYarValue(request, "projectInfrastucture") || null;
      let projectEquipment = getYarValue(request, "projectEquipment") || null;
      if(getYarValue(request, "abstraction")==='use currently'){
        return h.view(
          viewTemplate,
          createModel(null, projectInfrastucture, null)
        );
      }
      if(getYarValue(request, "abstraction")==='Maintain and introduce or increase a sustainable water source'){
        return h.view(
          viewTemplate,
          createModel(null, null, projectEquipment)
        );
      }
    },
  },
  {
    method: "POST",
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          projectInfrastucture: Joi.any(),
          projectEquipment: Joi.any(),
        }),
      },
      handler: (request, h) => {
        const errorList = [
          {
            text: "Select up to 3 options",
            href: "#projectInfrastucture",
          },
          {
            text: "Select up to 2 options",
            href: "#projectEquipment",
          },
        ];
        let { projectInfrastucture, projectEquipment } = request.payload;
        console.log('PAYLOAD', request.payload)

        if (!projectInfrastucture) {
          projectInfrastucture = getYarValue(request, "projectInfrastucture")
          gapiService.sendValidationDimension(request);
          return h.view(
            viewTemplate,
            createModel(
              [errorList[0]],
              projectInfrastucture,
              null
            )
          );
        }
        if (!projectEquipment) {
          projectEquipment = getYarValue(request, "projectEquipment")
          gapiService.sendValidationDimension(request);
          return h.view(
            viewTemplate,
            createModel(
              [errorList[1]],
              null,
              projectEquipment
            )
          );
        }

        if(projectInfrastucture){
          projectInfrastucture = [projectInfrastucture].flat();
          setYarValue(request, "projectInfrastucture", projectInfrastucture);
          const projectInfrastuctureList = projectInfrastucture.filter((x) => !!x);
          const projectItemsList = [...projectInfrastuctureList];
          setYarValue(request, "projectItemsList", projectItemsList);
          return h.redirect(nextPath);
        }
        
        if(projectEquipment){
          projectEquipment = [projectEquipment].flat();
          setYarValue(request, "projectEquipment", projectEquipment);
          const projectEquipmentList = projectEquipment.filter((x) => !!x);
          const projectItemsList = [...projectEquipmentList];
          setYarValue(request, "projectItemsList", projectItemsList);
          return h.redirect(nextPath);
        }
      },
    },
  },
];

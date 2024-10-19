/* Copyright 2023 Aures Tic - Jose Zambudio
   License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define("survey_question_type_binary", function (require) {
    "use strict";

    const survey_form = require("survey.form");

    survey_form.include({
        _prepareSubmitValues: async function (formData, params) {
            this._super(formData, params);
            var self = this;
            const promises = [];
            this.$("[data-question-type]").each(function () {
                switch ($(this).data("questionType")) {
                    case "binary":
                    case "multi_binary":
                        promises.push(
                            self._prepareSubmitBinaries(
                                params,
                                $(this),
                                $(this).data("name")
                            )
                        );
                        break;
                }
            });
            await Promise.all(promises);
        },

        _prepareSubmitBinaries: function (params, $binaryField, questionId) {
            console.log("Binary2");
            return this._prepareBinaryDatas(Object.values($binaryField[0].files)).then(
                (binaryDatas) => {
                    params[questionId] = binaryDatas;
                }
            );
        },

        _prepareBinaryDatas: async function (files) {
            const array = [];

            console.log("Binary3");
            for (const file of files) {
                const dataURL = await this._readFileAsDataURL(file);
                array.push({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: dataURL.split(",")[1],
                });
            }
            console.log(array);
            return array;
        },

        _readFileAsDataURL: function (file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        },
    });
});

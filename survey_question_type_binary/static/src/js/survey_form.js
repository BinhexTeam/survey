/* Copyright 2023 Aures Tic - Jose Zambudio
   License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define("survey_question_type_binary", function (require) {
    "use strict";

    const survey_form = require("survey.form");

    survey_form.include({
        _prepareSubmitValues: function (formData, params) {
            this._super(formData, params);
            var self = this;
            this.$("[data-question-type]").each(function () {
                switch ($(this).data("questionType")) {
                    case "binary":
                    case "multi_binary":
                        params = self._prepareSubmitBinaries(
                            params,
                            $(this),
                            $(this).data("name")
                        );
                        break;
                }
            });
        },

        _prepareSubmitBinaries: function (params, $binaryField, questionId) {
            console.log("params", params);
            console.log("questionId", questionId);
            console.log("$binaryField", $binaryField);
            console.log("files", $binaryField[0].files);
            const self = this;
            params[questionId] = this._prepareBinaryDatas(
                Object.values($binaryField[0].files)
            );
            return params;
        },

        _prepareBinaryDatas: function (files) {
            const array = [];
            files.each((file) => {
                array.push({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: this._readFileAsDataURL(file),
                });
            });
            return array;
        },

        _readFileAsDataURL: async function (file) {
            await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        },
    });
});

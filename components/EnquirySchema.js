import * as yup from "yup"

export const EnquirySchema = yup.object().shape({
    state_id: yup.string().required("Please select State"),
    city_id: yup.string().required("Please select District."),
    area_id: yup.string().required("Please select Block."),
    name: yup.string().required("Please enter Thikana name."),
    question: yup.array().of(
        yup.object().shape({
            answer: yup.string().required("Please fill the answer.")
        })
    ),
    terms_conditions: yup.boolean()
        .required('You must accept the terms and conditions')
        .oneOf([true], 'You must accept the terms and conditions.'),
})
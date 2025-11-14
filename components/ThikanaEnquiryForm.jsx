import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { EnquirySchema } from "./EnquirySchema";
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react";
import useApiService from "../services/ApiService";
import { toast } from "react-toastify";

function ThikanaEnquiryForm({
    openEnquiryModal,
    setOpenEnquiryModal,
    options,
    handleChange,
}) {
    const { addThikhanaenquiry, getThikanaQuestions } = useApiService();
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(false)
    const { handleSubmit, control, watch, formState: { errors }, reset, setValue } = useForm({
        mode: "onChange",
        resolver: yupResolver(EnquirySchema)
    })

    const getQuestions = () => {
        getThikanaQuestions().then(res => {
            if (res?.status == 200) {
                setQuestions(res?.data?.data)
            }
        }).catch(error => console.log(error))
    }

    useEffect(() => {
        getQuestions()
    }, [])

    const onSubmit = (data) => {
        const updatedQuestions = data?.question?.map((item, index) => ({
            question: questions[index].question,
            answer: item?.answer,
        }))

        setLoading(true)
        const _form = new FormData();
        _form.append("name", data?.name);
        _form.append("city_id", data.city_id);
        _form.append("state_id", data.state_id);
        _form.append("area_id", data.area_id);
        _form.append('meta_data', JSON.stringify(updatedQuestions))
        _form.append('image', data?.image)

        addThikhanaenquiry(_form).then((res) => {
            if (res?.data?.code === 200) {
                setOpenEnquiryModal(false);
                toast.success(res?.data?.message);
                reset()
            }
        })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }

    return (
        <Dialog
            open={openEnquiryModal}
            onClose={() => setOpenEnquiryModal(false)}
            PaperProps={{
                style: {
                    minWidth: "40%",
                },
            }}
        >
            <DialogTitle>Request to add your Thikana</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <div className="p-4 bg-purple-100 min-h-[90vh]">
                        <div className="bg-white rounded-md p-3 py-6 mt-4">
                            <div className="grid">
                                <div className="font-semibold">आपके ठिकाने का राज्य नाम?</div>
                                <div className="mt-2">
                                    <Controller
                                        name="state_id"
                                        defaultValue=''
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <select
                                                name="state_id"
                                                className="outline-none w-full text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                                                onChange={(e) => {
                                                    onChange(e)
                                                    handleChange(e)
                                                }}
                                                value={value}
                                            >
                                                <option value="" hidden>
                                                    Select State
                                                </option>
                                                {options?.state?.map((item, index) => {
                                                    return (
                                                        <option value={item?.id} key={index}>
                                                            {item?.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        )}
                                    />
                                    {errors?.state_id && (
                                        <div className="mt-1 text-red-600 text-sm">{errors?.state_id?.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-md p-3 py-6 mt-4">
                            <div className="grid">
                                <div className="font-semibold">आपके ठिकाने का जिले का नाम?</div>
                                <div className="mt-2">
                                    <Controller
                                        name="city_id"
                                        defaultValue=''
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <select
                                                name="city_id"
                                                className="outline-none w-full text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                                                onChange={(e) => {
                                                    onChange(e)
                                                    handleChange(e)
                                                }}
                                                value={value}
                                            >
                                                <option value="" hidden>
                                                    Select District
                                                </option>
                                                {options?.district?.length > 0 ? (
                                                    options?.district?.map((item, index) => {
                                                        return (
                                                            <option value={item?.id} key={index}>
                                                                {item?.name}
                                                            </option>
                                                        );
                                                    })
                                                ) : (
                                                    <option value="" disabled>
                                                        No District
                                                    </option>
                                                )}
                                            </select>
                                        )}
                                    />
                                    {errors?.city_id && (
                                        <div className="mt-1 text-red-600 text-sm">{errors?.city_id?.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-md p-3 py-6 mt-4">
                            <div className="grid">
                                <div className="font-semibold">आपके ठिकाने का ब्लॉक नाम?</div>
                                <div className="mt-2">
                                    <Controller
                                        name="area_id"
                                        defaultValue=''
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <select
                                                name="area_id"
                                                className="outline-none w-full text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                                                onChange={(e) => {
                                                    onChange(e)
                                                    handleChange(e)
                                                }}
                                                value={value}
                                            >
                                                <option value="" hidden>
                                                    Select Block
                                                </option>
                                                {options?.block?.length > 0 ? (
                                                    options?.block?.map((item, index) => {
                                                        return (
                                                            <option value={item?.id} key={index}>
                                                                {item?.name}
                                                            </option>
                                                        );
                                                    })
                                                ) : (
                                                    <option value="" disabled>
                                                        No Block
                                                    </option>
                                                )}
                                            </select>
                                        )}
                                    />
                                    {errors?.area_id && (
                                        <div className="mt-1 text-red-600 text-sm">{errors?.area_id?.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-md p-3 py-6 mt-4">
                            <div className="grid">
                                <div className="font-semibold">आपके ठिकाने का नाम?</div>
                                <div className="mt-2">
                                    <Controller
                                        name="name"
                                        defaultValue=""
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                name="name"
                                                type="text"
                                                className="placeholder:font-semibold outline-none w-full text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                                                placeholder="Your answer"
                                            />
                                        )}
                                    />
                                    {errors?.name && (
                                        <div className="mt-1 text-red-600 text-sm">{errors?.name?.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {questions?.length > 0 && questions?.map((item, index) => {
                            return (
                                <div className="bg-white rounded-md p-3 py-6 mt-4" key={index}>
                                    <div className="grid">
                                        <div className="font-semibold">{item?.question}</div>
                                        <div className="mt-2">
                                            <Controller
                                                name={`question[${index}].answer`}
                                                defaultValue=""
                                                control={control}
                                                render={({ field }) => (
                                                    item?.type == 'text' ? (
                                                        <input
                                                            {...field}
                                                            name={`question[${index}].answer`}
                                                            type="text"
                                                            placeholder="Your answer"
                                                            className="placeholder:font-semibold outline-none w-full text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                                                        />
                                                    ) : (
                                                        <input
                                                            name={`question[${index}].answer`}
                                                            type="file"
                                                            placeholder="Your answer"
                                                            className="placeholder:font-semibold outline-none w-full text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                                                            accept="image/png, image/gif, image/jpeg"
                                                            onChange={(e) => {
                                                                const selectedFile = e.target.files[0];
                                                                setValue(`question[${index}].answer`, selectedFile);
                                                                setValue("image", selectedFile)
                                                            }}
                                                        />
                                                    )
                                                )}
                                            />
                                            {errors?.question && errors?.question[index]?.answer && (
                                                <div className="mt-1 text-red-600 text-sm">
                                                    {errors?.question[index]?.answer?.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="bg-white rounded-md p-3 py-6 mt-4">
                            <Controller
                                name="terms_conditions"
                                control={control}
                                render={({ field }) => (
                                    <FormControl {...field}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox />
                                            }
                                            label="By submitting this form, I agree with JodiMilan's terms and conditions."
                                        />
                                        <FormHelperText error={errors?.terms_conditions?.message || ""}>
                                            {errors?.terms_conditions?.message}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button className="font-semibold text-purple-800"
                        onClick={() => setOpenEnquiryModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button className="font-semibold text-purple-800"
                        onClick={() => reset()}
                    >
                        Clear
                    </Button>
                    <Button
                        className="text-white font-medium bg-purple-800 hover:bg-purple-800"
                        type="submit"
                        disabled={loading ? true : false}
                    >
                        {loading ?
                            <CircularProgress size={20} className="text-white" />
                            : 'Submit'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ThikanaEnquiryForm
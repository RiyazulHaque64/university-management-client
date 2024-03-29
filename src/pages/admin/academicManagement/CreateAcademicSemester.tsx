import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Flex } from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import PHForm from "../../../components/form/PHForm";
import PHSelect from "../../../components/form/PHSelect";
import {
  monthOptions,
  nameOptions,
  yearOptions,
} from "../../../const/semester";
import { useAddAcademicSemesterMutation } from "../../../redux/features/admin/academicManagementApi";
import { createAcademicSemesterSchema } from "../../../schemas/academicManagementSchemas";
import { TAcademicSemester } from "../../../types";
import { TResponse } from "../../../types/global";

const CreateAcademicSemester = () => {
  const [addAcademicSemester] = useAddAcademicSemesterMutation();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");
    const name = nameOptions[Number(data?.name) - 1]?.label;
    const semesterData = {
      name,
      code: data.name,
      year: data.year,
      startMonth: data.startMonth,
      endMonth: data.endMonth,
    };
    try {
      const res = (await addAcademicSemester(
        semesterData
      )) as TResponse<TAcademicSemester>;
      if (res?.error) {
        toast.error(res?.error?.data?.message, { id: toastId });
      } else {
        toast.success("Academic semester added successfully", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: toastId });
    }
  };

  return (
    <Flex align="center" justify="center">
      <Col span={12}>
        <PHForm
          onSubmit={onSubmit}
          resolver={zodResolver(createAcademicSemesterSchema)}
        >
          <PHSelect label="Name" name="name" options={nameOptions} />
          <PHSelect label="Year" name="year" options={yearOptions} />
          <PHSelect
            label="Start Month"
            name="startMonth"
            options={monthOptions}
          />
          <PHSelect label="End Month" name="endMonth" options={monthOptions} />
          <Button htmlType="submit">Create</Button>
        </PHForm>
      </Col>
    </Flex>
  );
};

export default CreateAcademicSemester;

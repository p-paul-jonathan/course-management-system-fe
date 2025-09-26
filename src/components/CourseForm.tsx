import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MultiValue } from 'react-select';

import FormInput from "./FormInput";
import FormSubmit from "./FormSubmit";
import sendGraphqlRequest from "../utils/graphqlHandler";
import courseCreate from "../queries/courseCreate";
import useToast from "../hooks/useToast";
import CourseMutationResponseInterface from "../interfaces/graphql/courses/courseMutationResponseInterface";
import ErrorInterface from "../interfaces/graphql/common/errorInterface";
import CourseFormInterface from "../interfaces/common/courseFormInterface";
import courseUpdate from "../queries/courseUpdate";
import Toggle from "./Toggle";
import MarkdownInput from "./MarkdownInput";
import CreatableSelectSearch from "./CreatableSelectSearch";
import PaginationResponseInterface from "../interfaces/graphql/common/paginationResponseInterface";
import tags from "../queries/tags";
import TagInterface from "../interfaces/graphql/tag/tagInterface";
import tagCreate from "../queries/tagCreate";
import TagMutationResponseInterface from "../interfaces/graphql/tag/tagMutationResponseInterface";

interface CourseCreateResponse {
  data: { courseCreate: CourseMutationResponseInterface };
  errors?: [ErrorInterface];
}

interface CourseUpdateResponse {
  data: { courseUpdate: CourseMutationResponseInterface };
  errors?: [ErrorInterface];
}

interface CourseFormProps {
  type: 'create' | 'update';
  course?: CourseFormInterface;
  courseTags?: TagInterface[];
}

interface TagSearchDataInterface {
  data: { tags: PaginationResponseInterface; };
};

interface TagCreateResponse {
  data: { tagCreate: TagMutationResponseInterface; };
  errors?: [ErrorInterface]
}

function CourseForm(
  {
    type,
    course = {
      name: '',
      description: '',
      live: false
    },
    courseTags = []
  }: CourseFormProps
) {
  const [formState, setFormState] = useState<CourseFormInterface>({
    name: '',
    description: '',
    live: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    description: '',
    live: ''
  });
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tagData, setTagData] = useState<MultiValue<{ value: string, label: string; }> | []>([])

  useEffect(() => {
    if (type === 'update' && course) {
      setFormState(course);
      setTagData(mapTagDataFromGraphqlResponse(courseTags))
    }
  }, [type, course, courseTags]);

  function resetErrorMessages() {
    setErrorMessages({
      name: '',
      description: '',
      live: '',
    });
  }

  function assignErrorMessages(errors: [ErrorInterface]) {
    errors.forEach((error) => {
      setErrorMessages((prev) => ({
        ...prev,
        [error.location]: error.message
      }))
    })
  }

  function handleCourseCreateResponse({ data, errors }: CourseCreateResponse) {
    if (errors && errors.length > 0) {
      showToast(errors.map(e => e.message).join(', '), 'error');
      return;
    }

    const { errors: userErrors } = data.courseCreate

    if (userErrors.length > 0) {
      assignErrorMessages(userErrors);
      return;
    }

    showToast("Course Created Successfully", 'success');
    navigate(`/courses/${data.courseCreate.course.id}/edit`);
  }

  function handleCourseUpdateResponse({ data, errors }: CourseUpdateResponse) {
    if (errors && errors.length > 0) {
      showToast(errors.map(e => e.message).join(', '), 'error');
      return;
    }

    const { errors: userErrors } = data.courseUpdate

    if (userErrors.length > 0) {
      assignErrorMessages(userErrors);
      return;
    }

    showToast("Course Updated Successfully", 'success');
    navigate(`/courses/${data.courseUpdate.course.id}/edit`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    resetErrorMessages();

    const tagIds = tagData.map((tag) => (Number(tag.value)));
    setFormState(prev => ({ ...prev, tagIds }));


    if (type === 'create') {
      sendGraphqlRequest<CourseCreateResponse>(
        courseCreate,
        { course: formState },
        handleCourseCreateResponse,
        showToast
      );
    } else {
      sendGraphqlRequest<CourseUpdateResponse>(
        courseUpdate,
        { course: formState },
        handleCourseUpdateResponse,
        showToast
      );
    }
  }

  function formStateCases(target: HTMLInputElement) {
    if (target.type == "number") return parseFloat(target.value) || 0.0;
    if (target.type == "text") return target.value;
    if (target.type == "textarea") return target.value;
    if (target.checked !== undefined) return target.checked;

    return target.value;
  }

  function updateFormState(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;

    setFormState((prev) => ({
      ...prev,
      [target.name]: formStateCases(target),
    }));
  }

  function updateTagsData(newValue: MultiValue<{ value: string; label: string; }>) {
    setTagData(newValue)
  }

  async function loadTagsData(inputValue: string) {
    return new Promise<{ value: string, label: string }[]>((resolve) => {
      sendGraphqlRequest(
        tags,
        { searchTerm: inputValue },
        (graphqlResponse: TagSearchDataInterface) => resolve(mapTagDataFromGraphqlResponse(graphqlResponse.data.tags.tags)),
        showToast
      )
    })
  }

  function mapTagDataFromGraphqlResponse(tags?: TagInterface[]) {
    return tags?.map(
      (tag: TagInterface) => ({
        value: tag.id.toString(),
        label: tag.name

      })
    ) || []
  }

  function handleTagCreation(inputValue: string) {
    sendGraphqlRequest<TagCreateResponse>(
      tagCreate,
      { tag: { name: inputValue } },
      ({ data, errors }: TagCreateResponse) => {
        let message = ''

        if (errors && errors.length > 0) {
          message = errors.map(e => e.message).join(', ');
          showToast(message, 'error');
          return;
        }

        const { errors: userErrors, tag } = data.tagCreate;

        if (userErrors.length > 0) {
          message = userErrors.map(e => e.message).join(', ');
          showToast(message, 'error');
          return;
        }

        showToast('Tag Created Successfully', 'success');

        const newOption = {
          value: tag.id.toString(),
          label: tag.name
        }

        setTagData(prev => [...prev, newOption]);
      },
      showToast
    )
  }


  return (
    <>
      <div className="flex items-center justify-center h-full mt-10">
        <div className="p-5 border-2 rounded-2xl w-11/12 flex items-center">
          <div className="w-full">
            <h1 className="text-xl font-bold w-full text-center">
              {
                type == 'create' &&
                "Create Course"
              }
              {
                type == 'update' &&
                "Edit Course Details"
              }
            </h1>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <FormInput
                name="name"
                labelName="Name"
                required={true}
                value={formState.name}
                onChange={updateFormState}
                errorMessage={errorMessages.name}
              />

              <MarkdownInput
                name="description"
                labelName="Description"
                required={true}
                value={formState.description}
                onChange={updateFormState}
                errorMessage={errorMessages.description}
              />

              <Toggle
                name="live"
                labelName="Live"
                required={true}
                value={formState.live}
                onChange={updateFormState}
                errorMessage={errorMessages.live}
              />

              <CreatableSelectSearch
                name="tags"
                labelName="Tags"
                required={false}
                value={tagData}
                onChange={updateTagsData}
                promiseOptions={loadTagsData}
                handleCreate={handleTagCreation}
              />

              {
                type == 'create' ?
                  <FormSubmit name="Create" /> :
                  <FormSubmit name="Update" />
              }
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseForm

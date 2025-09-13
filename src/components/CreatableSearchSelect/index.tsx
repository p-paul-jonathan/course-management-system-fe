import { ChangeEvent, useState } from "react";
import FormInputLabel from "../FormInputLabel";
import sendGraphqlRequest from "../../utils/graphqlHandler";
import tags from "../../queries/tags";
import useToast from "../../hooks/useToast";
import PaginationResponseInterface from "../../interfaces/graphql/common/paginationResponseInterface";
import TagInterface from "../../interfaces/graphql/tag/tagInterface";
import PageInfoInterface from "../../interfaces/graphql/common/pageInfoInterface";

interface CreatableSearchSelectProps {
  name: string;
  labelName: string;
  required?: boolean;
}

interface FetchTagsInterface {
  data: { tags: PaginationResponseInterface }
}

function CreatableSearchSelect({ name, labelName, required }: CreatableSearchSelectProps) {
  const [newInputValue, setNewInputValue] = useState('');
  const [tagsData, setTagsData] = useState<TagInterface[]>();
  const [pageInfo, setPageInfo] = useState<PageInfoInterface>()
  const { showToast } = useToast();


  function showSearchResults({ data: { tags: tagsData } }: FetchTagsInterface) {
    setTagsData(tagsData.tags);
    setPageInfo(tagsData.pageInfo);
  }


  function searchNewInput(e: ChangeEvent) {
    const value = (e.target as HTMLInputElement).value;
    setNewInputValue(value);

    if(newInputValue.length < 2) { return; }

    sendGraphqlRequest<FetchTagsInterface>(
      tags,
      { searchTerm: value },
      showSearchResults,
      showToast
    )
  }

  return (
    <>
      <FormInputLabel name={name} labelName={labelName} required={required} />
      <input
        type="text"
        name={name}
        id={name}
        value={newInputValue}
        onChange={searchNewInput}
        className="border p-2 rounded w-full"
        {...(required ? { required: true } : {})}
        placeholder="Please enter at least 2 characters to start searching"
      />
      {
        tagsData && newInputValue.length > 2 ?
          <div>
            {
              tagsData.length > 0 ?
                tagsData.map((tag) => (
                  <div>{tag.name}</div>
                )) : <div className="w-full border rounded p-2">No Tags Found</div>
            }
          </div> : null
      }
    </>
  );
}

export default CreatableSearchSelect;

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import FormInput from '../FormInput';
import FormSubmit from '../FormSubmit';
import { useNavigate } from 'react-router';
import SelectSearch from '../SelectSearch';
import { MultiValue } from 'react-select';
import useToast from '../../hooks/useToast';
import PaginationResponseInterface from '../../interfaces/graphql/common/paginationResponseInterface';
import sendGraphqlRequest from '../../utils/graphqlHandler';
import users from '../../queries/users';
import UserInterface from '../../interfaces/graphql/users/userInterface';
import usersByIds from '../../queries/usersByIds';
import { Link } from 'react-router';

interface SearchBarProps {
  searchTerm: string;
  pathname: string;
  searchUserIds: number[];
}

interface UserSearchDataInterface { data: { users: PaginationResponseInterface; }; };
interface UserFindByIdsDataInterface { data: { usersByIds: PaginationResponseInterface; }; };

function SearchBar({ searchTerm, pathname, searchUserIds }: SearchBarProps) {
  const [showBar, setShowBar] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    search: searchTerm,
  })
  const [creatorData, setCreatorData] = useState<MultiValue<{ value: string; label: string; } | null>>()
  const navigate = useNavigate()
  const { showToast } = useToast();

  function mapCreatorDataFromGraphqlResponse(users?: UserInterface[]) {
    return users?.map(
      (user: UserInterface) => (
        {
          value: user.id.toString(),
          label: `${user.email} (${user.first_name} ${user.last_name})`
        }
      )
    ) || [];
  }

  useEffect(() => {
    if (searchTerm.length !== 0 || searchUserIds.length !== 0) {
      setShowBar(true);
    }
  }, [searchTerm, searchUserIds])

  useEffect(() => {
    sendGraphqlRequest(
      usersByIds,
      { ids: searchUserIds },
      ((graphqlResponse: UserFindByIdsDataInterface) => (setCreatorData(mapCreatorDataFromGraphqlResponse(graphqlResponse.data.usersByIds.users)))),
      showToast
    )
  }, [searchUserIds, showToast])

  function updateFormState(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;

    setFormState((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  }

  function updateCreatorData(newValue: MultiValue<{ value: string; label: string; } | null>) { setCreatorData(newValue); }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (pathname === '/courses-list/created') {
      navigate(`${pathname}?q=${formState.search}`)

    } else {
      const userIds = creatorData?.map((data) => (data?.value)) || []
      navigate(`${pathname}?q=${formState.search}&userIds=[${userIds}]`)
    }

  }

  function loadUsersData(inputValue: string) {
    return new Promise<{ value: string, label: string }[]>((resolve) => {
      sendGraphqlRequest(
        users,
        { searchTerm: inputValue },
        (graphqlResponse: UserSearchDataInterface) => resolve(mapCreatorDataFromGraphqlResponse(graphqlResponse.data.users.users)),
        showToast
      )
    });
  }

  return (
    <>
      <div className={`flex p-5 border rounded-2xl w-fit ${showBar && 'bg-gray-400 dark:bg-gray-800'} hover:bg-gray-400 dark:hover:bg-gray-800`} onClick={() => { setShowBar((prev) => !prev) }} >
        Search
        <MagnifyingGlassIcon className='size-6 ml-2 cursor-pointer' />
      </div>
      {
        showBar &&
        <form className="mt-4 space-y-3 border p-5 rounded-2xl" onSubmit={handleSubmit}>
          <div className='w-full text-center text-xl font-bold'>Search</div>
          <FormInput
            name='search'
            labelName='Search (Title, Description)'
            value={formState.search}
            required={false}
            onChange={updateFormState}
          />

          {
            pathname !== '/courses-list/created' &&
            <SelectSearch
              name='creator'
              labelName='Creator Name'
              value={creatorData}
              required={false}
              onChange={updateCreatorData}
              promiseOptions={loadUsersData}
            />
          }
          <div className='flex w-fit m-auto'>
            <FormSubmit name='Search' />
            <div className='flex justify-center ml-5'>
              <Link to="/courses-list/all" className='m-a text-white px-4 py-2 rounded bg-blue-800 hover:bg-blue-400 cursor-pointer'>Reset</Link>
            </div>
          </div>
        </form>
      }
    </>
  )
}

export default SearchBar;

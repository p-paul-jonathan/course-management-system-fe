import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router";

import PaginationResponseInterface from "../../interfaces/graphql/common/paginationResponseInterface";
import sendGraphqlRequest from "../../utils/graphqlHandler";
import courseQuery from "../../queries/courses";
import { PER_PAGE } from "../../utils/constants";
import CourseInterface from "../../interfaces/graphql/courses/courseInterface";
import CourseCard from "./CourseCard";
import PageInfoInterface from "../../interfaces/graphql/common/pageInfoInterface";
import PaginationBar from '../PaginationBar';
import createdCourses from "../../queries/createdCourses";
import useToast from "../../hooks/useToast";
import { Link } from "react-router";
import SearchBar from "../SearchBar";

interface coursesResponse {
  data: {
    courses?: PaginationResponseInterface;
    createdCourses?: PaginationResponseInterface;
  }
}


function CourseList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page') || 1);
  const searchTerm = String(searchParams.get('q') || '');
  const userIdsParam = searchParams.get('userIds');
  const searchUserIds = useMemo(
    () => JSON.parse(userIdsParam || '[]'),
    [userIdsParam]
  );
  const tagIdsParam = searchParams.get('tagIds');
  const searchTagIds = useMemo(
    () => JSON.parse(tagIdsParam || '[]'),
    [tagIdsParam]
  );
  const [courses, setCourses] = useState<CourseInterface[] | undefined>([]);
  const [pageInfo, setPageInfo] = useState<PageInfoInterface>();

  const { showToast } = useToast();

  const queryKey = useMemo(() => {
    if (pathname === '/courses-list/created') return 'createdCourses';

    return 'courses';
  }, [pathname]);

  const query = useMemo(() => {
    const queries = {
      createdCourses: createdCourses,
      courses: courseQuery
    }

    return queries[queryKey];
  }, [queryKey])

  useEffect(() => {
    function fetchCourses() {
      sendGraphqlRequest<coursesResponse>(
        query,
        {
          page: currentPage,
          per: PER_PAGE,
          searchTerm: searchTerm,
          userIds: searchUserIds,
          tagIds: searchTagIds
        },
        displayCourses,
        showToast
      )
    }

    function displayCourses({ data }: coursesResponse) {
      const courseList = data[queryKey];
      setCourses(courseList?.courses);
      setPageInfo(courseList?.pageInfo);
    }

    fetchCourses();
  }, [currentPage, queryKey, showToast, query, searchTerm, searchUserIds, searchTagIds]);

  return (
    <>
      <SearchBar searchTerm={searchTerm} pathname={pathname} searchUserIds={searchUserIds} searchTagIds={searchTagIds} />
      {
        queryKey == 'createdCourses' &&
        <div className="mt-5">
          <Link
            to="/courses/new"
            className="p-5 rounded-2xl bg-blue-600 text-white hover:bg-blue-400 block w-fit"
          >
            Create a Course
          </Link>
        </div>
      }

      {
        (!courses || courses?.length == 0) &&
        <p className="text-xl mt-5 w-full text-center font-bold">
          {
            queryKey === 'courses' &&
            "Oops! No courses found. Either there’s nothing here... or your search filters are playing hide-and-seek. 🤔🔍"
          }

          {
            queryKey === 'createdCourses' &&
            "No matching courses found. Either you haven't created any yet... or your filters are hiding them! 🎭🧐"
          }
        </p>
      }

      {
        (courses && courses.length > 0) &&
        <div className="mt-5 flex flex-wrap">
          {
            courses.map((course, index) => <CourseCard key={index} course={course} showAdminData={queryKey == 'createdCourses'} />)
          }
        </div>
      }

      {
        (courses && courses.length > 0) &&
        pageInfo &&
        <PaginationBar pageInfo={pageInfo} />
      }
    </>
  )
}

export default CourseList;

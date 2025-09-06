import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

import sendGraphqlRequest from "../utils/graphqlHandler";
import courseWithUser from "../queries/courseWithUser";
import useToast from "../hooks/useToast";
import CourseWithUserInterface from "../interfaces/graphql/courses/courseWithUserInterface";
import ChapterInterface from "../interfaces/graphql/chapters/chapterInterface";
import chapters from "../queries/chapters";
import ChapterCard from "../components/ChapterCard";
import PaginationResponseInterface from "../interfaces/graphql/common/paginationResponseInterface";
import PageInfoInterface from "../interfaces/graphql/common/pageInfoInterface";
import PaginationBar from "../components/PaginationBar";
import { useSearchParams } from "react-router";
import TagPill from "../components/TagPill";

interface FetchCourseInterface {
  data: { course: CourseWithUserInterface };
}

interface FetchChaptersInterface {
  data: { chapters: PaginationResponseInterface }
}

const defaultCourse: CourseWithUserInterface = {
  id: 0,
  name: '',
  description: '',
  created_at: '',
  updated_at: '',
  live: false,
  user: {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    created_at: '',
    updated_at: '',
  },
  chapter_order: [],
  tags: [],
};

function CourseShow() {
  const { id: courseId } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [course, setCourse] = useState(defaultCourse);
  const [showAbout, setShowAbout] = useState(true);
  const [showChapters, setShowChapters] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [chaptersData, setChaptersData] = useState<[ChapterInterface]>();
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState<PageInfoInterface>();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('chapter-page') || 1)
  const PER_PAGE = 5;

  const assignCourseData = useCallback(({ data: { course: fetchedCourse } }: FetchCourseInterface) => {
    if (!fetchedCourse.live) {
      navigate('/courses-list/all');
      showToast('Course Does not Exist', 'error');
    }
    setCourse(fetchedCourse);
  }, [navigate, showToast]);

  const assignChaptersData = useCallback(({ data: { chapters: chaptersData } }: FetchChaptersInterface) => {
    setChaptersData(chaptersData.chapters)
    setPageInfo(chaptersData.pageInfo)
  }, [])

  useEffect(() => {
    if (!courseId) return;

    sendGraphqlRequest<FetchCourseInterface>(
      courseWithUser,
      { id: courseId },
      assignCourseData,
      showToast
    );

    sendGraphqlRequest(
      chapters,
      {
        courseId: courseId,
        page: currentPage,
        per: PER_PAGE
      },
      assignChaptersData,
      showToast
    )
  }, [courseId, assignCourseData, showToast, assignChaptersData, currentPage]);

  return (
    <>
      <h1 className="text-3xl font-extrabold text-center">
        <Link to="/courses-list/all" className="text-blue-600 hover:text-blue-400">Courses</Link> / {course.name}
      </h1>
      <p className="text-center">
        By:&nbsp;
        <Link to={`/courses-list/all?userIds=[${course.user.id}]`} className="text-blue-500 underline hover:text-blue-800">
          {[course.user.first_name, course.user.last_name].filter(Boolean).join(" ")}
        </Link>
      </p>

      <div
        className="text-2xl font-bold cursor-pointer mt-4 flex"
        onClick={() => setShowAbout(prev => !prev)}
      >
        About this Course

        {
          showAbout ?
            <ChevronUpIcon className="ml-5 size-6" /> :
            <ChevronDownIcon className="ml-5 size-6" />
        }
      </div>

      {
        showAbout && (
          <div className="prose dark:prose-invert mt-5 m-auto border rounded-2xl p-5 w-11/12 max-w-11/12">
            <ReactMarkdown>{course.description}</ReactMarkdown>
          </div>
        )
      }

      <div
        className="text-2xl font-bold cursor-pointer mt-4 flex"
        onClick={() => setShowTags(prev => !prev)}
      >
        Tags
        {
          showTags ?
            <ChevronUpIcon className="ml-5 size-6" /> :
            <ChevronDownIcon className="ml-5 size-6" />
        }
      </div>

      <div className="w-full flex flex-wrap mt-5">
        {
          showTags && (
            course.tags.length > 0 ? (
              course.tags.map((tag) => (
                <TagPill tag={tag} />
              ))
            ) : null
          )
        }
      </div>

      <div
        className="text-2xl font-bold cursor-pointer mt-4 flex"
        onClick={() => setShowChapters(prev => !prev)}
      >
        Chapters
        {
          showChapters ?
            <ChevronUpIcon className="ml-5 size-6" /> :
            <ChevronDownIcon className="ml-5 size-6" />
        }
      </div>

      {
        chaptersData && (
          showChapters ? (
            chaptersData.length > 0 ? (
              chaptersData.map((chapter) => (
                <ChapterCard chapter={chapter} courseId={courseId} key={chapter.id} />
              ))
            ) : (
              <div className="text-xl font-bold mt-5">No Chapters Yet</div>
            )
          ) : null
        )
      }

      {
        (chaptersData && chaptersData.length > 0) &&
        showChapters &&
        pageInfo &&
        <PaginationBar pageInfo={pageInfo} pageName="chapter-page" />
      }
    </>
  );
}

export default CourseShow;

import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

import MovableChapterCard from "./MovableChapterCard";
import sendGraphqlRequest from "../utils/graphqlHandler";
import chapters from "../queries/chapters";
import useToast from "../hooks/useToast";
import PaginationResponseInterface from "../interfaces/graphql/common/paginationResponseInterface";
import ChapterInterface from "../interfaces/graphql/chapters/chapterInterface";
import PageInfoInterface from "../interfaces/graphql/common/pageInfoInterface";
import PaginationBar from "./PaginationBar";
import courseWithUser from "../queries/courseWithUser";
import CourseWithUserInterface from "../interfaces/graphql/courses/courseWithUserInterface";
import getCurrentUser from "../utils/getCurrentUser";
import UserInterface from "../interfaces/graphql/users/userInterface";
import CourseMutationResponseInterface from "../interfaces/graphql/courses/courseMutationResponseInterface";
import ErrorInterface from "../interfaces/graphql/common/errorInterface";
import updateChapterOrderQuery from "../queries/updateChapterOrder";

interface EditChaptersListProps {
  courseId?: string;
}

interface ChaptersResponse {
  data: { chapters: PaginationResponseInterface }
}

interface FetchCourseInterface {
  data: { course: CourseWithUserInterface }
}

interface UpdateChapterOrderResponse {
  data: { updateChapterOrder: CourseMutationResponseInterface };
  errors?: [ErrorInterface]
}

function EditChaptersList({ courseId }: EditChaptersListProps) {
  const [course, setCourse] = useState<CourseWithUserInterface>()
  const [chaptersData, setChaptersData] = useState<ChapterInterface[]>()
  const [pageInfo, setPageInfo] = useState<PageInfoInterface>();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page') || 1)
  const PER_PAGE = 10;

  useEffect(() => {
    async function currentUserIsOwner(owner: UserInterface): Promise<boolean> {
      const currentUser = await getCurrentUser(showToast);

      if (currentUser?.id == owner.id) { return true; }

      return false;
    }

    async function assignCourse({ data: { course: courseData } }: FetchCourseInterface) {
      if (!courseData) {
        showToast('Course not found', 'error');
        navigate('/courses-list/created');
        return;
      }
      if (!(await currentUserIsOwner(courseData.user))) {
        showToast('You are not authorized to edit this course', 'error');
        navigate('/courses-list/created');
        return;
      }

      setCourse(courseData)
    }

    function fetchChapters() {
      sendGraphqlRequest<ChaptersResponse>(
        chapters,
        {
          courseId: courseId,
          page: currentPage,
          per: PER_PAGE
        },
        assignChapters,
        showToast
      )
    }

    function fetchCourse() {
      sendGraphqlRequest<FetchCourseInterface>(
        courseWithUser,
        { id: courseId },
        assignCourse,
        showToast
      )
    }

    fetchCourse()
    fetchChapters();
  }, [courseId, showToast, currentPage, navigate])



  function assignChapters({ data: { chapters } }: ChaptersResponse) {
    setChaptersData(chapters.chapters);
    setPageInfo(chapters.pageInfo);
  }

  function moveChapterUpInOrder(chapterId: number) {
    if (course === undefined) { return; }

    const chapterOrder = course.chapter_order
    const chapterIndex = chapterOrder.findIndex(cid => cid == chapterId)

    if (chapterIndex == 0) { return; }

    const switchIndex = chapterIndex - 1

    const temp = chapterOrder[chapterIndex];
    chapterOrder[chapterIndex] = chapterOrder[switchIndex];
    chapterOrder[switchIndex] = temp;

    updateChapterOrder(chapterOrder);
  }

  function moveChapterDownInOrder(chapterId: number) {
    if (course === undefined) { return; }

    const chapterOrder = course.chapter_order
    const chapterIndex = chapterOrder.findIndex(cid => cid == chapterId)

    if (chapterIndex == chapterOrder.length - 1) { return; }

    const switchIndex = chapterIndex + 1

    const temp = chapterOrder[chapterIndex];
    chapterOrder[chapterIndex] = chapterOrder[switchIndex];
    chapterOrder[switchIndex] = temp;

    updateChapterOrder(chapterOrder);
  }

  function updateChapterOrder(chapterOrder: number[]): void {
    sendGraphqlRequest<UpdateChapterOrderResponse>(
      updateChapterOrderQuery,
      {
        id: courseId,
        chapterOrder: chapterOrder.map(Number)
      },
      handleCourseUpdate,
      showToast
    )
  }

  function handleCourseUpdate({ data, errors }: UpdateChapterOrderResponse) {
    if (errors && errors.length > 0) {
      showToast(errors.map(e => e.message).join(', '), 'error');
      return;
    }

    const { errors: userErrors } = data.updateChapterOrder

    if (userErrors.length > 0) {
      showToast(userErrors.map(e => e.message).join(', '), 'error');
      return;
    }

    showToast("Chapter Order Updated Successfully", 'success');
    navigate(`/courses/${data.updateChapterOrder.course.id}/edit/chapters?page=${currentPage}`);
  }

  return (
    <>
      <div className="mt-5">
        <Link
          to={`/courses/${courseId}/chapters/new`}
          className="p-5 rounded-2xl bg-blue-600 text-white hover:bg-blue-400 block w-fit"
        >
          Add a Chapter
        </Link>
      </div>
      {
        chaptersData && (
          chaptersData.length > 0 ? (
            chaptersData.map((chapter) => (
              <MovableChapterCard key={chapter.id} chapter={chapter} courseId={courseId} moveChapterUpInOrder={moveChapterUpInOrder} moveChapterDownInOrder={moveChapterDownInOrder} />
            ))
          ) : (
            <div className="text-lg font-bold mt-5">
              No Chapters Yet, <Link to={`/courses/${courseId}/chapters/new`} className="text-blue-600 hover:text-blue-400">Add a chapter</Link>
            </div>
          )
        )
      }
      {
        (chaptersData && chaptersData.length > 0) &&
        pageInfo &&
        <PaginationBar pageInfo={pageInfo} pageName="page" />
      }
    </>
  );
};

export default EditChaptersList;

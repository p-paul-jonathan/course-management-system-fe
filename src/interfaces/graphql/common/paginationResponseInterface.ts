import ChapterInterface from "../chapters/chapterInterface";
import CourseInterface from "../courses/courseInterface";
import TagInterface from "../tag/tagInterface";
import UserInterface from "../users/userInterface";
import PageInfoInterface from "./pageInfoInterface";

interface PaginationResponseInterface {
  courses?: CourseInterface[];
  chapters?: ChapterInterface[];
  users?: UserInterface[];
  tags?: TagInterface[];
  pageInfo: PageInfoInterface;
}

export default PaginationResponseInterface;

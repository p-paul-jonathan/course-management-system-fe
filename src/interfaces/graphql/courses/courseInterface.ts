import TagInterface from "../tag/tagInterface";

interface CourseInterface {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  live: boolean;
  chapter_order: number[];
  tags: TagInterface[];
}

export default CourseInterface;

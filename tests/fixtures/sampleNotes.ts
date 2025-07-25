import type { Note } from "@/types.js";

export const sampleNote1: Note = {
  id: "1",
  title: "Meeting Notes",
  content: "Discussion about project timeline and resources",
  tags: ["work", "meeting"],
  created: new Date("2024-01-15T10:00:00Z"),
  modified: new Date("2024-01-15T10:30:00Z"),
};

export const sampleNote2: Note = {
  id: "2",
  title: "Shopping List",
  content: "Milk\nBread\nEggs\nButter",
  tags: ["personal", "shopping"],
  created: new Date("2024-01-16T08:00:00Z"),
  modified: new Date("2024-01-16T08:15:00Z"),
};

export const sampleNote3: Note = {
  id: "3",
  title: "Project Ideas",
  content:
    "1. Build a note-taking app\n2. Create a task manager\n3. Develop a calendar integration",
  tags: ["ideas", "projects", "development"],
  created: new Date("2024-01-17T14:00:00Z"),
  modified: new Date("2024-01-17T14:45:00Z"),
};

export const noteWithSpecialCharacters: Note = {
  id: "4",
  title: 'Note with "quotes" & special chars',
  content:
    "This note contains:\n- \"Double quotes\"\n- 'Single quotes'\n- Newlines\n- Tabs\t\there",
  tags: ["test", "special-chars"],
  created: new Date("2024-01-18T12:00:00Z"),
  modified: new Date("2024-01-18T12:05:00Z"),
};

export const emptyNote: Note = {
  id: "5",
  title: "",
  content: "",
  tags: [],
  created: new Date("2024-01-19T09:00:00Z"),
  modified: new Date("2024-01-19T09:00:00Z"),
};

export const allSampleNotes: Note[] = [
  sampleNote1,
  sampleNote2,
  sampleNote3,
  noteWithSpecialCharacters,
  emptyNote,
];

/**
 * Interface for member
 * @param id {string} - The id of the member.
 * @param name {string} - The name of the member.
 * @param role {string} - The role of the member.
 * @param avatar {string} - The avatar image url of the member.
 * @param description {string} - The description of the member.
 * @interface IMember - Interface for member
 */
export interface IMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description?: string;
}

export interface IMembers {
  members: IMember[];
}

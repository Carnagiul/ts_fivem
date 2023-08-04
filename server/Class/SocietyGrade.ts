import { Society } from "Society";

export interface SocietyGrade {
    id: number;
    society: Society;
    name: string;
    salary: number;
    offsalary: number;
    permissions: string[];
};
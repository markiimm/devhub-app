export type ProjectStatus = "Em desenvolvimento" | "Pausado" | "Concluído";
export type ProblemStatus = "Aberto" | "Investigando" | "Resolvido";
export type Severity = "good" | "warning" | "serious" | "critical";
export type ToolStatus = "Usando" | "Quero testar";

export interface ProjectDna {
  arquitetura?: string;
  banco?: string;
  auth?: string;
  hospedagem?: string;
  ferramentas?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          handle: string | null;
          title: string | null;
          bio: string | null;
          location: string | null;
          avatar_color: string;
          stacks: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          tagline: string | null;
          status: ProjectStatus;
          progress: number;
          tech: string[];
          apis: string[];
          github: string | null;
          dna: ProjectDna;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      project_tasks: {
        Row: { id: string; project_id: string; title: string; done: boolean; position: number; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["project_tasks"]["Row"]> & { project_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["project_tasks"]["Row"]>;
      };
      project_problems: {
        Row: { id: string; project_id: string; title: string; status: ProblemStatus; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["project_problems"]["Row"]> & { project_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["project_problems"]["Row"]>;
      };
      project_updates: {
        Row: { id: string; project_id: string; body: string; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["project_updates"]["Row"]> & { project_id: string; body: string };
        Update: Partial<Database["public"]["Tables"]["project_updates"]["Row"]>;
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string | null;
          tags: string[];
          body: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notes"]["Row"]> & { user_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["notes"]["Row"]>;
      };
      snippets: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          lang: string;
          tags: string[];
          description: string | null;
          code: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["snippets"]["Row"]> & { user_id: string; title: string; code: string };
        Update: Partial<Database["public"]["Tables"]["snippets"]["Row"]>;
      };
      errors: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          tech: string | null;
          severity: Severity;
          cause: string | null;
          solution: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["errors"]["Row"]> & { user_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["errors"]["Row"]>;
      };
      ideas: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string | null;
          description: string | null;
          problem: string | null;
          solution: string | null;
          features: string[];
          tech: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ideas"]["Row"]> & { user_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["ideas"]["Row"]>;
      };
      tools: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string | null;
          status: ToolStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tools"]["Row"]> & { user_id: string; name: string };
        Update: Partial<Database["public"]["Tables"]["tools"]["Row"]>;
      };
    };
  };
}

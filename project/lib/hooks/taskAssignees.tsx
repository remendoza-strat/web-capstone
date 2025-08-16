import { createTaskAssigneeAction } from "@/lib/db/actions"
import { useMutation } from "@tanstack/react-query"
import { NewTaskAssignee } from "@/lib/db/schema"

// Uses createTaskAssigneeAction()
export function createTaskAssignee(){
  return useMutation({
    mutationFn: async (newTaskAssignee: NewTaskAssignee) => {
      await createTaskAssigneeAction(newTaskAssignee);
    }
  });
}
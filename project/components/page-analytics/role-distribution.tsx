"use client"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Users } from "lucide-react"
import { MembersWithData, RoleArr } from "@/lib/customtype"

export function RoleDistribution({ members }: { members: MembersWithData[] }){
  // Get count per role
  const roleData = RoleArr.map((role) => ({
    role,
    count: members.filter((m) => m.role === role).length
  }));

  return(
    <div className="p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Role Distribution
        </h3>
        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={roleData}>
            <PolarGrid/>
            <PolarAngleAxis dataKey="role"/>
            <PolarRadiusAxis angle={30}/>
            <Tooltip/>
            <Radar
              name="Members"
              dataKey="count"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
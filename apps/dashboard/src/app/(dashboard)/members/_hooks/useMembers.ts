import { useQuery } from "@tanstack/react-query"
import { UserServiceApi, V1ListUsersRequest } from "@package/api"
import { QUERY_KEYS } from "@package/utils"
import { V1User, V1Gender } from "@package/api"

interface UseMembersOptions {
  pageSize?: number
  pageOffset?: number
  search?: string
  sort?: string[]
}

const userService = new UserServiceApi()

const DEMO_MEMBERS: V1User[] = [
  {
    id: "usr_01",
    username: "johndoe",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    birthday: "1990-01-15",
    gender: V1Gender.Male,
    roles: [
      { id: "role_1", name: "Admin" },
      { id: "role_2", name: "Developer" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
    }
  },
  {
    id: "usr_02",
    username: "janesmith",
    name: "Jane Smith",
    phone: "+1 (555) 234-5678",
    email: "jane.smith@example.com",
    birthday: "1992-03-20",
    gender: V1Gender.Female,
    roles: [
      { id: "role_3", name: "Manager" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=Jane+Smith&background=4CAF50&color=fff"
    }
  },
  {
    id: "usr_03",
    username: "bobwilson",
    name: "Bob Wilson",
    phone: "+1 (555) 345-6789",
    email: "bob.wilson@example.com",
    birthday: "1988-07-10",
    gender: V1Gender.Male,
    roles: [
      { id: "role_4", name: "Designer" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=Bob+Wilson&background=FF5722&color=fff"
    }
  },
  {
    id: "usr_04",
    username: "sarahlee",
    name: "Sarah Lee",
    phone: "+1 (555) 456-7890",
    email: "sarah.lee@example.com",
    birthday: "1995-11-30",
    gender: V1Gender.Female,
    roles: [
      { id: "role_2", name: "Developer" },
      { id: "role_5", name: "Team Lead" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=Sarah+Lee&background=9C27B0&color=fff"
    }
  },
  {
    id: "usr_05",
    username: "alexchen",
    name: "Alex Chen",
    phone: "+1 (555) 567-8901",
    email: "alex.chen@example.com",
    birthday: "1993-09-25",
    gender: V1Gender.Other,
    roles: [
      { id: "role_6", name: "Product Owner" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=Alex+Chen&background=3F51B5&color=fff"
    }
  },
  {
    id: "usr_06",
    username: "emmadavis",
    name: "Emma Davis",
    phone: "+1 (555) 678-9012",
    email: "emma.davis@example.com",
    birthday: "1991-05-12",
    gender: V1Gender.Female,
    roles: [
      { id: "role_7", name: "QA Engineer" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=Emma+Davis&background=E91E63&color=fff"
    }
  },
  {
    id: "usr_07",
    username: "michaelbrown",
    name: "Michael Brown",
    phone: "+1 (555) 789-0123",
    email: "michael.brown@example.com",
    birthday: "1987-12-03",
    gender: V1Gender.Male,
    roles: [
      { id: "role_8", name: "DevOps Engineer" },
      { id: "role_9", name: "Security Specialist" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=Michael+Brown&background=795548&color=fff"
    }
  },
  {
    id: "usr_08",
    username: "oliviakim",
    name: "Olivia Kim",
    phone: "+1 (555) 890-1234",
    email: "olivia.kim@example.com",
    birthday: "1994-08-18",
    gender: V1Gender.Female,
    roles: [
      { id: "role_10", name: "UX Researcher" }
    ],
    avatar: {
      url: "https://ui-avatars.com/api/?name=Olivia+Kim&background=009688&color=fff"
    }
  }
]


export function useMembers({
  pageSize = 10,
  pageOffset = 0,
  search = "",
  sort = [],
}: UseMembersOptions = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.USERS(), pageSize, pageOffset, search, sort],
    queryFn: () =>
      userService.userServiceListUsers({
        pageOffset,
        pageSize,
        search,
        sort,
      }),
  })

  return {
    members: DEMO_MEMBERS,
    totalSize: DEMO_MEMBERS.length,
    filterSize: DEMO_MEMBERS.length,
    isLoading: false,
    error: null,
    refetch: () => { },
  }
}


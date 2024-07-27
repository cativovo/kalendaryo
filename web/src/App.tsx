import Calendar from "@/components/calendar";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { login, me } from "./api/auth";

const queryClient = new QueryClient();

function Foo() {
  const mutation = useMutation({
    mutationFn() {
      return login("admin", "admin");
    },
  });
  const query = useQuery({
    queryKey: ["foo"],
    queryFn: me,
    enabled: false,
    retry: false,
  });

  return (
    <>
      <button onClick={() => mutation.mutate()}>login</button>
      <br />
      <button onClick={() => query.refetch()}>me</button>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Calendar />
      <Foo />
    </QueryClientProvider>
  );
}

export default App;

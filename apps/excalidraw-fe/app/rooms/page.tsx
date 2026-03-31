"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/config/http-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema } from "@repo/common/schema";
import { Calendar, Link as LinkIcon, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Room {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
  admin: {
    id: string;
    username: string;
  };
  // code: string;
  // createdBy: string;
  // participants: number;
  // isOwner: boolean;
}

const Dashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<any>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: any) => {
    if (values.name.trim()) {
      try {
        const res = await api.post("/room", { name: values.name });

        if (res.data.success) {
          setRooms((prev) => [res.data.room, ...prev]);
          form.reset();
          setIsCreateDialogOpen(false);
          toast.success("Room created successfully!");
        }
      } catch (err: any) {
        // setError(err.response.data.message);
        toast.error(err.response.data.message);
      }
    }
  };

  const handleJoinRoom = async () => {
    try {
      const res = await api.post("/room/join", { name: joinCode });

      if (res.data.success) {
        setRooms((prev) => [res.data.room, ...prev]);
        form.reset();
        setIsCreateDialogOpen(false);
        toast.success("Room created successfully!");
      }
    } catch (err: any) {
      // setError(err.response.data.message);
      toast.error(err.response.data.message);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    // setRooms(rooms.filter((room) => room.id !== roomId));
    // toast.success("The room has been permanently deleted.");
  };

  const filteredRooms =
    rooms.length > 0
      ? rooms?.filter((item) =>
          item.room.slug.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];
  console.log(filteredRooms, "filteredRoomsfilteredRooms");
  useEffect(() => {
    const getData = async () => {
      setLoading(false);

      try {
        const res = await api.get("/rooms");

        if (res.data && res.data.success) {
          console.log(res.data.rooms, "dddddddddddddddddd");
          setRooms(res.data.rooms);
        }
      } catch (err: any) {
        // setError(err.response.data.message);
        console.log(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return <div>loading....</div>;
  }
  console.log(rooms, "sdfsfd");
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                DrawFlow Studio
              </h1>
              <p className="text-muted-foreground">
                Collaborative whiteboard workspace
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" onClick={() => setJoinCode("")}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Join Room
              </Button>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Room</DialogTitle>
                    <DialogDescription>
                      Create a new collaborative whiteboard room for your team.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter room name..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          Cancel
                        </Button>

                        <Button type="submit">Create Room</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Join Section */}
      <div className="container mx-auto px-6 py-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Join</CardTitle>
            <CardDescription>
              Have a room code? Join an existing collaborative session
              instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter room code (e.g., ABC123)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={handleJoinRoom} disabled={!joinCode.trim()}>
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-6 pb-12">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Your Rooms
          </h2>
          <p className="text-muted-foreground">
            Manage your collaborative whiteboard sessions (
            {filteredRooms.length} rooms)
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No rooms found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "Create your first room to start collaborating."}
                </p>
                {!searchQuery && (
                  <Button
                    variant="hero"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Room
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-foreground text-lg mb-1">
                        {room.room.slug}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {room.room.id}
                        </Badge>
                        {room.id && (
                          <Badge
                            variant="outline"
                            className="text-xs border-primary text-primary"
                          >
                            Owner
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* {room.isOwner && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )} */}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          5 participant
                          {/* {room.participants} participant
                          {room.participants !== 1 ? "s" : ""} */}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {room.room.createdAt.toString().split("T")[0]}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created by:{" "}
                      <span className="text-foreground">
                        {room.room.admin.username}
                      </span>
                    </div>
                    <Link href={`/rooms/${room.room.id}`}>
                      <Button className="w-full" variant="default">
                        Enter Room
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

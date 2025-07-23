"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Users,
  Calendar,
  Settings,
  Trash2,
  Link,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  participants: number;
  createdAt: string;
  isOwner: boolean;
}

const Dashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Design Brainstorm",
      code: "ABC123",
      createdBy: "You",
      participants: 3,
      createdAt: "2024-01-15",
      isOwner: true,
    },
    {
      id: "2",
      name: "Team Planning",
      code: "XYZ789",
      createdBy: "John Doe",
      participants: 5,
      createdAt: "2024-01-14",
      isOwner: false,
    },
    {
      id: "3",
      name: "Architecture Review",
      code: "DEF456",
      createdBy: "You",
      participants: 2,
      createdAt: "2024-01-13",
      isOwner: true,
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      const newRoom: Room = {
        id: Date.now().toString(),
        name: newRoomName,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdBy: "You",
        participants: 1,
        createdAt: new Date().toISOString().split("T")[0],
        isOwner: true,
      };
      setRooms([newRoom, ...rooms]);
      setNewRoomName("");
      setIsCreateDialogOpen(false);
      toast.success("Room created successfully!");
    }
  };

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      toast.message("Joining room...");
      setJoinCode("");
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
    toast.success("The room has been permanently deleted.");
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <Link className="h-4 w-4 mr-2" />
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
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="roomName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="roomName"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="Enter room name..."
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateRoom}
                      disabled={!newRoomName.trim()}
                    >
                      Create Room
                    </Button>
                  </DialogFooter>
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
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
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
                        {room.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {room.code}
                        </Badge>
                        {room.isOwner && (
                          <Badge
                            variant="outline"
                            className="text-xs border-primary text-primary"
                          >
                            Owner
                          </Badge>
                        )}
                      </div>
                    </div>
                    {room.isOwner && (
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
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {room.participants} participant
                          {room.participants !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{room.createdAt}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created by:{" "}
                      <span className="text-foreground">{room.createdBy}</span>
                    </div>
                    <Button className="w-full" variant="default">
                      Enter Room
                    </Button>
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

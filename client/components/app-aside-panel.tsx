import { BellRing, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { Switch } from "@/components/ui/switch"

const notifications = [
    {
        title: "Name 1",
        description: "1 hour ago",
    },
    {
        title: "Name 2",
        description: "1 hour ago",
    },
    {
        title: "Name 3",
        description: "2 hours ago",
    },
]

type CardProps = React.ComponentProps<typeof Card>

export function AsidePanel({ className, ...props }: CardProps) {
    return (
        <Card className={cn("w-[300px]", className)} {...props}>
            <CardHeader>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full max-w-sm"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                                <div className="p-1">
                                    <Card className="rounded-full w-12 h-12">

                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <CardTitle className="pt-10">Recent Chats</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div>
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="mb-4 grid grid-cols-[40px_1fr] items-start gap-4 pb-4 border-b last:mb-0 last:pb-0 last:border-none"
                        >
                            <div className="flex items-center">
                                <Avatar className="relative">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                    <span className="absolute bottom-0 right-0 z-1000 h-3 w-3 rounded-full border-2 border-white bg-lime-500" />
                                </Avatar>
                            </div>
                            <div className="space-y-1">
                                <p className="text-base font-medium text-gray-900">
                                    {notification.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {notification.description}
                                </p>
                            </div>
                        </div>

                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <Check /> Mark all as read
                </Button>
            </CardFooter>
        </Card>
    )
}

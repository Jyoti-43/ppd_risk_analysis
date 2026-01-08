import { Heart, CheckCircle } from "lucide-react";

export function GroupHeader() {
  return (
    <div className="bg-gradient-to-br from-secondary via-accent to-secondary">
      <div className="max-w-7xl mx-auto px-6 py-16 pb-4 relative">
        {/* Decorative element */}

        <div className="flex gap-5 items-start">
          {/* Group icon */}
          <div className="bg-card rounded-lg p-4 shrink-0">
            <Heart className="w-12 h-12 text-primary fill-primary" />
          </div>

          {/* Group info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Postpartum Anxiety Support Group
            </h1>
            <p className="text-foreground mb-6">
              A safe, non-judgmental space to discuss anxiety symptoms and
              coping strategies.
            </p>

            {/* Stats and buttons */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xl font-bold">1,245</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
                {/* <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">54 Online now</span>
                </div> */}
              </div>

              {/* Avatars */}
              {/* <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-card"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-pink-600 border-2 border-card"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-600 border-2 border-card"></div>
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-card flex items-center justify-center text-xs font-bold">
                  +%
                </div>
              </div> */}

              {/* Action buttons */}
              {/* <div className="flex gap-3 ml-auto"> */}
                {/* <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition">
                  <CheckCircle className="w-4 h-4" />
                  Joined
                </button> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

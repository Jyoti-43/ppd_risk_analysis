import { Lock, Calendar, Users } from "lucide-react"

export function Sidebar() {
  return (
    <div className="space-y-6">
      {/* About this Group */}
      <div className="bg-card rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">About this Group</h3>
        <p className="text-foreground text-sm leading-relaxed mb-4">
          Welcome to the Postpartum Anxiety Support Group. We are a community of mothers supporting each other through
          PPA. This is a judgment-free zone.
        </p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Private Group</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created Jan 2023</span>
          </div>
        </div>
      </div>

      {/* Group Rules */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Group Rules</h3>
          <a href="#" className="text-primary text-sm hover:underline">
            View All
          </a>
        </div>
        <ol className="space-y-2 text-sm text-foreground">
          <li>
            <span className="text-primary font-semibold">1.</span> Be kind and courteous.
          </li>
          <li>
            <span className="text-primary font-semibold">2.</span> Respect everyone's privacy.
          </li>
          <li>
            <span className="text-primary font-semibold">3.</span> No medical advice.
          </li>
        </ol>
      </div>

      {/* Admins & Moderators */}
      <div className="bg-card rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Admins & Moderators</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex-shrink-0"></div>
            <div>
              <div className="font-semibold text-sm">Dr. Emily</div>
              <div className="text-xs text-muted-foreground">Admin • Psychologist</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0"></div>
            <div>
              <div className="font-semibold text-sm">Jessica M.</div>
              <div className="text-xs text-muted-foreground">Moderator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Friends */}
      <div className="bg-accent rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-bold text-lg mb-2">Know someone who needs support?</h3>
        <p className="text-sm text-foreground mb-4">Invite other mothers to join this group.</p>
        <button className="text-primary font-semibold hover:underline w-full">Invite Friends</button>
      </div>
    </div>
  )
}

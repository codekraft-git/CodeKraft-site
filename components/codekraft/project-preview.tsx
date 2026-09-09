import { ArrowUpRight, BookOpen, Check, LayoutGrid, Play, Search, Clock3 } from "lucide-react";

export function ProjectPreview({ variant }: { variant: "learning" | "operations" }) {
  return <div className={`project-preview preview-${variant}`} aria-hidden="true">
    <div className="preview-browser">
      <div className="browser-bar"><span/><span/><span/><small>{variant === "learning" ? "A space to keep growing" : "A little more clarity"}</small></div>
      {variant === "learning" ? <div className="learning-ui">
        <div className="preview-nav"><span><BookOpen size={15}/> Learnspace</span><span className="preview-status-tag"><span className="pulse-dot"/>Live cohort</span><span>Explore <span className="preview-avatar">A</span></span></div>
        <div className="learning-heading"><small>YOUR NEXT CHAPTER</small><h4>Curiosity is<br/>a good beginning.</h4><p>Make a little room for something new.</p><span className="mini-button">Explore courses <ArrowUpRight size={12}/></span></div>
        <div className="learning-lessons"><div><span className="lesson-icon"><LayoutGrid size={20}/></span><small>DESIGN</small><strong>The fundamentals<br/>of better interfaces.</strong><span>8 lessons <ArrowUpRight size={12}/></span></div><div><span className="lesson-icon"><Play size={20}/></span><small>DEVELOPMENT</small><strong>Build something<br/>worth opening.</strong><span>12 lessons <ArrowUpRight size={12}/></span></div></div>
      </div> : <div className="operations-ui">
        <aside><span className="op-logo"><LayoutGrid size={17}/></span><span className="op-selected"><LayoutGrid size={14}/></span><span><Clock3 size={14}/></span><span><Check size={14}/></span></aside>
        <div className="op-main"><div className="op-topline"><span>Workspace / Overview</span><span className="preview-status-tag"><span className="pulse-dot pulse-dot-green"/>3 pipelines synced</span><Search size={13}/></div><div className="op-title"><div><small>MONDAY, SEPTEMBER 7</small><h4>Room to do your best work.</h4></div><span className="preview-avatar">A</span></div><div className="op-stats"><div><small>Active projects</small><strong>06</strong></div><div><small>In progress</small><strong>12</strong></div><div><small>Completed</small><strong>28</strong></div></div><div className="op-list"><div><strong>Project</strong><small>Status</small></div>{["Website experience", "Mobile application", "Design system"].map((item, i) => <div key={item}><span><span className="op-square">{i + 1}</span>{item}</span><small className={i === 2 ? "status-review" : "status-active"}><span className="pulse-dot-tiny"/>{i === 2 ? "In review" : "In progress"}</small></div>)}</div></div>
      </div>}
    </div>
  </div>;
}

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./stylesheets/tutorialscreen.css";

const NAV_ITEMS = [
  {
    label: "Introduction",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    label: "Data Structures",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="6" height="6" rx="1" />
        <rect x="9" y="3" width="6" height="6" rx="1" />
        <rect x="16" y="3" width="6" height="6" rx="1" />
        <rect x="2" y="12" width="6" height="6" rx="1" />
        <rect x="9" y="12" width="6" height="6" rx="1" />
      </svg>
    ),
    active: true,
  },
  {
    label: "Algorithms",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
  {
    label: "Operating Systems",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="3" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="21" />
        <line x1="3" y1="12" x2="9" y2="12" />
        <line x1="15" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
  {
    label: "Networking",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <rect x="2" y="18" width="6" height="4" rx="1" />
        <rect x="16" y="18" width="6" height="4" rx="1" />
        <line x1="12" y1="6" x2="12" y2="13" />
        <line x1="5" y1="18" x2="12" y2="13" />
        <line x1="19" y1="18" x2="12" y2="13" />
      </svg>
    ),
  },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-title">Computer Science</p>
        <p className="sidebar-subtitle">Academic Series</p>
        <button onClick = {() => navigate("/quiz")} className="quiz-start-btn">Attempt Quiz</button>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <a
            href="#"
            key={item.label}
            className={`sidebar-item ${item.active ? "active" : ""}`}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function ArticleSection({ title, body, bullets }) {
  return (
    <section className="article-section">
      <h2>{title}</h2>
      {body && <p className="body-text">{body}</p>}
      {bullets && (
        <ul className="feature-list">
          {bullets.map(({ term, detail }) => (
            <li key={term}>
              <strong>{term}:</strong> {detail}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function TutorialScreen() {
  return (
    <div className="app">
      <Navbar activeLink="Tutorials" />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <article>
            <h1>Data Structures: Arrays vs. Linked Lists</h1>
            <p className="intro">
              Understanding the fundamental differences between arrays and linked
              lists is a cornerstone of computer science. Both structures are
              used to store collections of data, but they approach memory
              management and data access in fundamentally opposite ways. Choosing
              the correct structure dictates the efficiency of your algorithms,
              impacting both time and space complexity.
            </p>

            <ArticleSection
              title="The Array: Contiguous Memory"
              body="An array is a linear data structure that collects elements of the same memory size and stores them in contiguous memory locations. Because the memory is contiguous, calculating the address of any element becomes a simple mathematical operation based on its index."
              bullets={[
                {
                  term: "Constant Time Access",
                  detail:
                    "Accessing an element by index takes O(1) time. The processor simply adds the offset (index × element size) to the base address.",
                },
                {
                  term: "Cache Locality",
                  detail:
                    "Iterating through an array is highly efficient because adjacent elements are loaded into the CPU cache together.",
                },
                {
                  term: "Fixed Size",
                  detail:
                    "In many languages, arrays have a fixed size allocated at creation. Expanding an array requires allocating a new, larger block of memory and copying the old elements.",
                },
              ]}
            />

            <ArticleSection
              title="The Linked List: Dynamic Nodes"
              body="A linked list is a linear collection of data elements where order is not given by their physical placement in memory. Instead, each element (called a node) contains the data itself and a reference (or pointer) to the next node in the sequence."
              bullets={[
                {
                  term: "Dynamic Size",
                  detail:
                    "Linked lists can easily grow and shrink during execution by allocating or deallocating individual nodes. Memory does not need to be contiguous.",
                },
                {
                  term: "Efficient Insertions/Deletions",
                  detail:
                    "Adding or removing a node from the beginning or middle of the list can be done in O(1) time if the reference to the preceding node is already known.",
                },
                {
                  term: "Sequential Access",
                  detail:
                    "Elements must be accessed sequentially starting from the first node (head). Accessing the nth element requires traversing n nodes, resulting in O(n) access time.",
                },
                {
                  term: "Memory Overhead",
                  detail:
                    "Each node requires extra memory to store the pointer(s) to the next (and possibly previous) node.",
                },
              ]}
            />

            <ArticleSection
              title="Architectural Comparison"
              body="When designing a system, the choice between these two structures often comes down to the frequency of read operations versus the frequency of write (insert/delete) operations. If your application requires rapid access to random elements and the data set size is relatively static, arrays are superior. Conversely, if your application involves a constantly fluctuating data set with frequent insertions and deletions, especially in the middle of the collection, a linked list will prevent costly memory reallocation operations."
            />
          </article>
        </main>
      </div>
    </div>
  );
}
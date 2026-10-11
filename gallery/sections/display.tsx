import { useState, type ReactNode } from "react";
import { Badge, Count, StatusDot } from "../../src/badge";
import { Tag, TagGroup } from "../../src/tag";
import { Alert } from "../../src/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "../../src/card";
import { Avatar, AvatarFallback, AvatarGroup } from "../../src/avatar";
import { Skeleton } from "../../src/skeleton";
import { Meter } from "../../src/meter";
import { Progress } from "../../src/progress";
import { Separator } from "../../src/separator";
import { Link } from "../../src/link";
import { Breadcrumb } from "../../src/breadcrumb";
import { Stack, Inline, Container } from "../../src/layout";
import { ToastProvider, useToast } from "../../src/toast";
import { Spinner } from "../../src/spinner";
import { Icon } from "../../src/icon";
import { Button } from "../../src/button";
import { Kbd } from "../../src/kbd";
import { Code, Heading } from "../../src/text";
import { Input } from "../../src/input";
import { Textarea } from "../../src/textarea";
import { Field, Label } from "../../src/field";
import { Truncate } from "../../src/truncate";
function ToastControls() {
  const { toast } = useToast();
  return (
    <Button
      size="xs"
      variant="ghost"
      onClick={() =>
        toast({
          title: "Published fr.json",
          description: "3 servers updated",
          tone: "success",
          action: (
            <Button size="xs" variant="secondary">
              Undo
            </Button>
          ),
        })
      }
    >
      Add notification
    </Button>
  );
}
export function Feedback({ children }: { children?: ReactNode }) {
  const [tags, setTags] = useState(["fr", "de", "pt-BR"]);
  return (
    <>
      <section className="g-sec" id="w4-display">
        <h2>5 · Feedback &amp; display</h2>
        <div className="g-grid">
          <div className="g-cell">
            <h3>Badge · Count · Dot · Tag</h3>
            <Stack gap="2">
              <Inline>
                <Badge>Draft</Badge>
                <Badge tone="info">Beta</Badge>
                <Badge tone="success" icon={<Icon name="check" />}>
                  Published
                </Badge>
                <Badge tone="warning">Outdated</Badge>
                <Badge tone="danger">Failed</Badge>
              </Inline>
              <Inline>
                <Badge tone="info" variant="solid">
                  v2.4
                </Badge>
                <Badge tone="danger" variant="solid">
                  3 errors
                </Badge>
                <Badge tone="success" variant="outline">
                  online
                </Badge>
              </Inline>
              <Inline>
                <Inline gap="1">
                  <Icon name="source-control" />
                  <Count value={12} tone="info" />
                </Inline>
                <Inline gap="1">
                  <Icon name="bell" />
                  <Count value={142} tone="danger" />
                </Inline>
                <Inline gap="1-5">
                  <StatusDot tone="success" pulse label="Live" />
                  Live
                </Inline>
                <Inline gap="1-5">
                  <StatusDot tone="warning" label="Degraded" />
                  Degraded
                </Inline>
              </Inline>
              <TagGroup aria-label="Languages">
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    onRemove={() =>
                      setTags((all) => all.filter((t) => t !== tag))
                    }
                  >
                    {tag}
                  </Tag>
                ))}
              </TagGroup>
            </Stack>
          </div>
          <div className="g-cell">
            <h3>Spinner · Skeleton · Progress · Meter</h3>
            <Stack gap="3">
              <Inline>
                <Spinner size="xs" />
                <Spinner />
                <Spinner size="lg" />
                <span
                  style={{
                    fontSize: "var(--onyx-text-sm)",
                    color: "var(--onyx-text-description)",
                  }}
                >
                  Loading workspaces…
                </span>
              </Inline>
              <Stack gap="1-5">
                <Skeleton style={{ width: "60%" }} />
                <Skeleton style={{ width: "90%" }} />
                <Skeleton style={{ width: "40%" }} />
              </Stack>
              <Progress indeterminate aria-label="Loading workspaces" />
              <Meter
                label="Storage"
                value={3.1}
                max={5}
                valueText="3.1 / 5 GB"
              />
              <Meter
                label="API quota"
                value={94}
                tone="danger"
                valueText="94%"
              />
            </Stack>
          </div>
          <div className="g-cell wide">
            <h3>
              Alert <code>inline · banner · tones · actions</code>
            </h3>
            <Stack gap="2">
              <Alert
                title="A new Babel version is available"
                description="Version 0.18 adds streaming zip downloads."
                actions={
                  <>
                    <Button size="sm" variant="secondary">
                      Later
                    </Button>
                    <Button size="sm">Update</Button>
                  </>
                }
              />
              <Alert
                tone="warning"
                title="2 bricks failed to load"
                description="glossary and json-tools need Babel ≥ 0.17."
              />
              <Alert
                tone="danger"
                title="Connection lost"
                description="Reconnecting in 4s…"
                dismissible
              />
              <Alert
                tone="success"
                variant="banner"
                title="All changes published"
                description="fr.json pushed to 3 servers."
              />
            </Stack>
          </div>
          <div className="g-cell">
            <h3>
              Card <code>header · body · footer · interactive</code>
            </h3>
            <Card interactive>
              <CardHeader>
                <Avatar
                  variant="square"
                  style={
                    {
                      "--onyx-avatar-bg": "var(--onyx-tone-info-bg)",
                      "--onyx-avatar-fg": "var(--onyx-tone-info-fg)",
                    } as React.CSSProperties
                  }
                >
                  <AvatarFallback>
                    <Icon name="notebook" />
                  </AvatarFallback>
                </Avatar>
                <Stack gap="0-5" style={{ flex: 1 }}>
                  <CardTitle>notes</CardTitle>
                  <CardDescription>notes.bedrock.dev</CardDescription>
                </Stack>
                <Badge tone="success" icon={<StatusDot tone="success" />}>
                  Running
                </Badge>
              </CardHeader>
              <CardBody>Shared notes with live sync and attachments.</CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  Logs
                </Button>
                <Button variant="secondary" size="sm">
                  Open
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="g-cell">
            <h3>
              Avatar <code>image · initials · status · group</code>
            </h3>
            <Stack gap="2">
              <Inline>
                <Avatar
                  name="Profile"
                  size="lg"
                  src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23DA702C'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23FFFCF0'/%3E%3Crect x='8' y='26' width='24' height='14' rx='7' fill='%23FFFCF0'/%3E%3C/svg%3E"
                />
                <Avatar
                  name="Marius Roiban"
                  size="lg"
                  status="success"
                  statusLabel="Marius is online"
                />
                <Avatar name="Ada Lovelace" />
                <Avatar name="Jane" size="sm" />
              </Inline>
              <AvatarGroup max={3} aria-label="Collaborators">
                {[
                  "Marius Roiban",
                  "Ada Lovelace",
                  "John Doe",
                  "Nora",
                  "Sam",
                  "Lee",
                  "Alex",
                ].map((name, i) => (
                  <Avatar
                    key={name}
                    name={name}
                    style={
                      i === 1 || i === 2
                        ? ({
                            "--onyx-avatar-bg": `var(--onyx-tone-${i === 1 ? "info" : "success"}-bg)`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  />
                ))}
              </AvatarGroup>
            </Stack>
          </div>
          <div className="g-cell">
            <h3>Breadcrumb · Separator · Code · Kbd</h3>
            <Stack gap="3">
              <Breadcrumb
                items={[
                  {
                    label: (
                      <>
                        <Icon name="root-folder" />
                        mods
                      </>
                    ),
                    href: "#mods",
                  },
                  { label: "Babel", href: "#babel" },
                  { label: "bricks", href: "#bricks" },
                  { label: "i18n", href: "#i18n" },
                  { label: "fr.json" },
                ]}
                maxItems={4}
              />
              <Separator />
              <Separator label="or continue with" />
              <Inline gap="2">
                Run <Code>bedrock db generate</Code> then press <Kbd>⌘</Kbd>
                <Kbd>S</Kbd>
                <Separator orientation="vertical" />
                <span
                  style={{
                    fontSize: "var(--onyx-text-sm)",
                    color: "var(--onyx-text-description)",
                  }}
                >
                  2 files
                </span>
              </Inline>
              <Truncate
                mode="middle"
                endCharacters={25}
                style={{
                  position: "relative",
                  maxWidth: "calc(var(--onyx-space-10) * 5.5)",
                  fontSize: "var(--onyx-text-sm)",
                }}
              >
                /Users/stellar/Playground/babel-ui/bricks/explorer/ExplorerView.tsx
              </Truncate>
            </Stack>
          </div>
          <div className="g-cell">
            <h3>
              Toast queue <code>stacked · actions · auto-dismiss</code>
            </h3>
            <div
              className="stage"
              style={{ minHeight: "calc(var(--onyx-space-10) * 4.25)" }}
            >
              <ToastProvider
                inline
                duration={60000}
                initialToasts={[
                  { title: "Indexing workspace", tone: "info" },
                  { title: "Token expires soon", tone: "warning" },
                  {
                    title: "Published fr.json",
                    description: "3 servers updated",
                    tone: "success",
                    action: (
                      <>
                        <Button size="xs" variant="secondary">
                          Undo
                        </Button>
                        <Button size="xs" variant="ghost">
                          View log
                        </Button>
                      </>
                    ),
                  },
                ]}
              >
                <ToastControls />
              </ToastProvider>
            </div>
          </div>
          {children}
        </div>
      </section>
    </>
  );
}

export function Layout() {
  return (
    <>
      <section className="g-sec" id="w4-layout">
        <h2>7 · Layout</h2>
        <div className="g-grid">
          <div className="g-cell wide">
            <h3>
              Stack · Inline · Container <code>gap from --onyx-space-*</code>
            </h3>
            <Container size="sm">
              <Stack gap="4" asChild>
                <form onSubmit={(e) => e.preventDefault()}>
                  <Stack gap="1">
                    <Heading>New note</Heading>
                    <CardDescription>
                      Shared with everyone in this pebble.
                    </CardDescription>
                  </Stack>
                  <Field>
                    <Label htmlFor="note-title">Title</Label>
                    <Input
                      id="note-title"
                      defaultValue="Translation glossary"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="note-body">Body</Label>
                    <Textarea
                      id="note-body"
                      defaultValue={"Use “vous” for shopkeepers."}
                    />
                  </Field>
                  <Inline justify="end">
                    <Button type="reset" variant="ghost">
                      Cancel
                    </Button>
                    <Button type="submit">Save note</Button>
                  </Inline>
                </form>
              </Stack>
            </Container>
            <p className="g-note">
              This whole form is written without app CSS — the success criterion
              for agents building pebbles.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export function DisplayActions() {
  return (
    <div className="g-cell">
      <h3>
        Link <code>internal · external · muted</code>
      </h3>
      <Inline gap="3">
        <Link href="#w4-layout">Open settings</Link>
        <Link href="https://bedrock.dev" external>
          Documentation
        </Link>
        <Link href="#w4-display" variant="muted">
          Learn more
        </Link>
      </Inline>
    </div>
  );
}

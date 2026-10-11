import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../../src/components/dialog";
import { DatePicker } from "../../src/components/date-picker";
import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "../../src/components/button";
import { InputGroup, InputGroupInput } from "../../src/components/input-group";
import { Icon } from "../../src/components/icon";
import { Badge } from "../../src/components/badge";
import { Avatar, AvatarFallback } from "../../src/components/avatar";
import { Checkbox } from "../../src/components/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
} from "../../src/components/popover";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from "../../src/components/menu";
import { Tooltip, TooltipProvider } from "../../src/components/tooltip";
import { Truncate } from "../../src/components/truncate";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../../src/components/hover-card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogIcon,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../src/components/alert-dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetBody,
  SheetFooter,
} from "../../src/components/sheet";
import { Combobox } from "../../src/components/combobox";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "../../src/components/menubar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "../../src/components/navigation-menu";

function Cell({
  title,
  detail,
  height,
  children,
  note,
}: {
  title: string;
  detail?: string;
  height: number;
  children: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div className="g-cell">
      <h3>
        {title}
        <code>{detail}</code>
      </h3>
      <div
        className="stage"
        style={{
          minHeight:
            title === "Menu"
              ? "max(350px,calc(var(--onyx-menu-item-height,var(--onyx-control-height-md)) * 10 + var(--onyx-space-8)))"
              : height,
        }}
      >
        {children}
      </div>
      {note && <p className="g-note">{note}</p>}
    </div>
  );
}
/** Independent documents keep real modal focus traps from disabling other demos. */
function ModalFrame({
  kind,
  open,
}: {
  kind: "alert" | "sheet";
  open: boolean;
}) {
  const [doc, setDoc] = React.useState<Document>();
  React.useEffect(() => {
    if (!doc) return;
    const sync = () => {
      for (const key of ["data-theme", "data-density"])
        doc.documentElement.setAttribute(
          key,
          document.documentElement.getAttribute(key) ??
            (key === "data-theme" ? "dark" : "compact"),
        );
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [doc]);
  return (
    <>
      <iframe
        title={
          kind === "alert"
            ? "Alert dialog demonstration"
            : "Sheet demonstration"
        }
        style={{
          width: "100%",
          height: 220,
          border: 0,
          borderRadius: "var(--onyx-radius-lg)",
        }}
        srcDoc={
          "<!doctype html><html><head>" +
          Array.from(
            document.querySelectorAll<HTMLLinkElement>(
              'link[rel="stylesheet"]',
            ),
          )
            .map((link) => `<link rel="stylesheet" href="${link.href}">`)
            .join("") +
          "<style>.onyx-modal,.onyx-sheet,.onyx-overlay{animation:none;transition:none}body{margin:0;font-family:var(--onyx-font-family);font-size:var(--onyx-text-md);color:var(--onyx-text-foreground);background:var(--onyx-surface-app)}.onyx-modal{max-height:calc(100dvh - var(--onyx-space-2));width:calc(100vw - var(--onyx-space-8));padding:var(--onyx-space-4);gap:var(--onyx-space-2)}.onyx-overlay-title{font-size:var(--onyx-text-lg)}.onyx-sheet{width:80vw}.onyx-sheet-body{padding:var(--onyx-space-4)}.onyx-overlay-footer{margin-top:var(--onyx-space-1-5)}</style></head><body></body></html>"
        }
        onLoad={(event) =>
          setDoc(event.currentTarget.contentDocument ?? undefined)
        }
      />
      {doc &&
        createPortal(
          kind === "alert" ? (
            <AlertDialog open={open ? true : undefined}>
              <AlertDialogTrigger asChild>
                <Button
                  style={open ? { visibility: "hidden" } : undefined}
                  variant="secondary"
                >
                  Discard changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                container={doc.body}
                tone="danger"
                onOpenAutoFocus={(event) => {
                  if (open) event.preventDefault();
                }}
              >
                <AlertDialogHeader style={{ flexWrap: "wrap" }}>
                  <AlertDialogIcon />
                  <AlertDialogTitle>
                    Discard 3 unsaved changes?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Changes to <code>fr.json</code>, <code>content.json</code> and
                  1 other file will be lost.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className={open ? "focus-demo" : undefined}
                  >
                    Keep editing
                  </AlertDialogCancel>
                  <AlertDialogAction>Discard</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Sheet open={open ? true : undefined}>
              <SheetTrigger asChild>
                <Button
                  style={open ? { visibility: "hidden" } : undefined}
                  variant="secondary"
                >
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                container={doc.body}
                onOpenAutoFocus={(event) => {
                  if (open) event.preventDefault();
                }}
              >
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Close filters"
                    >
                      <Icon name="close" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
                <SheetDescription className="sr-only">
                  Filter translation files.
                </SheetDescription>
                <SheetBody>
                  <label className="row">
                    <Checkbox defaultChecked />
                    Untranslated
                  </label>
                  <label className="row">
                    <Checkbox />
                    Needs review
                  </label>
                </SheetBody>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button size="sm">Apply</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ),
          doc.body,
        )}
    </>
  );
}
export default function Section() {
  const [showOpen, setShowOpen] = React.useState(true);
  React.useEffect(() => {
    if (location.hash === "#overlays") {
      const timer = setTimeout(
        () => document.getElementById("overlays")?.scrollIntoView(),
        400,
      );
      return () => clearTimeout(timer);
    }
  }, []);
  const [hidden, setHidden] = React.useState(true);
  const [compact, setCompact] = React.useState(false);
  const [sort, setSort] = React.useState("name");
  const forced = showOpen ? true : undefined;
  const noFocus = (event: Event) => {
    if (showOpen) event.preventDefault();
  };
  return (
    <section className="g-sec" id="overlays">
      {new URLSearchParams(location.search).get("section") === "overlays" && (
        <style>{".g-sec:not(#overlays),.g-bar{display:none}"}</style>
      )}
      <style>
        {
          '.w1-workspace [data-slot="button-label"]{width:100%;justify-content:flex-start}.w1-workspace{font-weight:var(--onyx-weight-regular)}.w1-combobox .onyx-combobox-control{border-color:var(--onyx-control-focus-ring);box-shadow:inset 0 0 0 1px var(--onyx-control-focus-ring)}'
        }
      </style>
      <h2>
        3 · Overlays{" "}
        <Button
          size="xs"
          variant="ghost"
          pressed={showOpen}
          onClick={() => setShowOpen(!showOpen)}
        >
          Show open states
        </Button>
      </h2>
      <style>{".nested-constrained-panel{max-height:calc(var(--onyx-space-10) * 3)}"}</style>
      <Dialog>
        <DialogTrigger asChild><Button variant="secondary">Open nested overlay Dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Nested Dialog overlays</DialogTitle><DialogDescription>Exercise floating controls inside a Dialog.</DialogDescription></DialogHeader>
          <Combobox label="Dialog language" options={[{value:"fr",label:"French"},{value:"en",label:"English"}]} />
          <DatePicker label="Dialog date" defaultValue={new Date(2026,9,6)} />
          <Popover><PopoverTrigger asChild><Button variant="secondary">Dialog constrained panel</Button></PopoverTrigger>
            <PopoverContent className="nested-constrained-panel"><PopoverArrow />{Array.from({length:20},(_,i)=><p key={i}>Scrollable line {i+1}</p>)}</PopoverContent>
          </Popover>
          <DialogFooter><DialogClose asChild><Button variant="ghost">Close Dialog</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet>
        <SheetTrigger asChild><Button variant="secondary">Open nested overlay Sheet</Button></SheetTrigger>
        <SheetContent>
          <SheetHeader><SheetTitle>Nested overlays</SheetTitle><SheetClose asChild><Button variant="ghost">Close</Button></SheetClose></SheetHeader>
          <SheetDescription className="sr-only">Exercise floating controls inside a modal.</SheetDescription>
          <SheetBody>
            <Combobox label="Sheet language" options={[{value:"fr",label:"French"},{value:"en",label:"English"}]} />
            <DatePicker label="Sheet date" defaultValue={new Date(2026,9,6)} />
            <Menu><MenuTrigger asChild><Button variant="secondary">Sheet actions</Button></MenuTrigger>
              <MenuContent><MenuItem>Review files</MenuItem><MenuItem>Export files</MenuItem></MenuContent>
            </Menu>
            <Popover><PopoverTrigger asChild><Button variant="secondary">Constrained panel</Button></PopoverTrigger>
              <PopoverContent className="nested-constrained-panel"><PopoverArrow />{Array.from({length:20},(_,i)=><p key={i}>Scrollable line {i+1}</p>)}</PopoverContent>
            </Popover>
          </SheetBody>
        </SheetContent>
      </Sheet>
      <TooltipProvider delayDuration={300}>
        <div className="g-grid">
          <Cell
            title="Popover"
            detail="anchored · arrow · focus-trap"
            height={230}
          >
            <Popover open={forced}>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Icon name="cloud" />
                  babel-cloud
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={12}
                onOpenAutoFocus={noFocus}
              >
                <PopoverArrow />
                <PopoverHeader>
                  <strong style={{ flex: 1 }}>Cloud workspace</strong>
                  <Badge tone="success">
                    <span
                      style={{
                        width: "var(--onyx-space-2)",
                        height: "var(--onyx-space-2)",
                        background: "currentColor",
                        borderRadius: "var(--onyx-radius-full)",
                      }}
                    />
                    Live
                  </Badge>
                </PopoverHeader>
                <PopoverBody>
                  <InputGroup
                    leading={<Icon name="search" />}
                    style={{ height: "var(--onyx-control-height-sm)" }}
                  >
                    <InputGroupInput
                      placeholder="Filter workspaces"
                      aria-label="Filter workspaces"
                    />
                  </InputGroup>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w1-workspace"
                    pressed
                  >
                    <Icon name="folder" />
                    babel-translations
                    <span className="onyx-menu-shortcut">2m</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w1-workspace">
                    <Icon name="folder" />
                    stardew-expanded
                    <span className="onyx-menu-shortcut">3d</span>
                  </Button>
                  <MenuSeparator />
                  <PopoverFooter style={{ justifyContent: "space-between" }}>
                    <Button variant="link" size="sm">
                      Sign out
                    </Button>
                    <Button size="sm">Connect</Button>
                  </PopoverFooter>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Cell>
          <Cell
            title="Menu"
            detail="button-triggered · submenu · check · radio"
            height={350}
            note={
              <>
                Same item styles as ContextMenu. Replaces Babel’s{" "}
                <code>MenuHost</code> flyouts.
              </>
            }
          >
            <Menu modal={false} open={forced}>
              <MenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="More">
                  <Icon name="ellipsis" />
                </Button>
              </MenuTrigger>
              <MenuContent
                align="start"
                sideOffset={6}
                style={{ minWidth: 164 }}
                onCloseAutoFocus={noFocus}
              >
                <MenuItem>
                  <Icon name="new-file" />
                  New file<MenuShortcut>⌘N</MenuShortcut>
                </MenuItem>
                <MenuSub open={forced}>
                  <MenuSubTrigger>
                    <Icon name="go-to-file" />
                    Open recent
                  </MenuSubTrigger>
                  <MenuSubContent style={{ minWidth: 104 }} sideOffset={4}>
                    {["i18n/fr.json", "content.json", "manifest.json"].map(
                      (text) => (
                        <MenuItem key={text}>{text}</MenuItem>
                      ),
                    )}
                  </MenuSubContent>
                </MenuSub>
                <MenuSeparator />
                <MenuLabel>View</MenuLabel>
                <MenuCheckboxItem
                  checked={hidden}
                  onCheckedChange={(checked) => setHidden(checked === true)}
                >
                  Show hidden files
                </MenuCheckboxItem>
                <MenuCheckboxItem
                  checked={compact}
                  onCheckedChange={(checked) => setCompact(checked === true)}
                >
                  Compact folders
                </MenuCheckboxItem>
                <MenuSeparator />
                <MenuRadioGroup value={sort} onValueChange={setSort}>
                  <MenuRadioItem value="name">Sort by name</MenuRadioItem>
                  <MenuRadioItem value="modified">
                    Sort by modified
                  </MenuRadioItem>
                </MenuRadioGroup>
                <MenuSeparator />
                <MenuItem disabled>
                  <Icon name="cloud-upload" />
                  Publish<MenuShortcut>⇧⌘P</MenuShortcut>
                </MenuItem>
                <MenuItem tone="danger">
                  <Icon name="trash" />
                  Delete
                </MenuItem>
              </MenuContent>
            </Menu>
          </Cell>
          <Cell
            title="Tooltip"
            detail="delay group · shortcut · truncation"
            height={150}
            note="Truncate shows the full text in a tooltip only when it actually overflows."
          >
            <div className="row" style={{ paddingTop: 40 }}>
              <Tooltip content="Split editor">
                <Button variant="ghost" size="icon-sm" aria-label="Split">
                  <Icon name="split-horizontal" />
                </Button>
              </Tooltip>
              <Tooltip
                content="Refresh explorer"
                shortcut="⌘R"
                open={forced}
                contentProps={{ align: "start", sideOffset: 8 }}
              >
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Refresh"
                  style={
                    showOpen
                      ? { background: "var(--onyx-state-hover)" }
                      : undefined
                  }
                >
                  <Icon name="refresh" />
                </Button>
              </Tooltip>
              <Tooltip content="Collapse all">
                <Button variant="ghost" size="icon-sm" aria-label="Collapse">
                  <Icon name="collapse-all" />
                </Button>
              </Tooltip>
            </div>
            <Truncate
              style={{
                marginTop: 22,
                maxWidth: 200,
                fontSize: "var(--onyx-text-sm)",
                padding: "var(--onyx-space-0-5) var(--onyx-space-1)",
                background: "var(--onyx-state-hover)",
                borderRadius: "var(--onyx-radius-sm)",
              }}
              tooltipProps={{
                open: forced,
                side: "bottom",
                contentProps: { align: "start", sideOffset: 4 },
              }}
            >
              mods/[CP] Sunberry Village/i18n/fr.json
            </Truncate>
          </Cell>
          <Cell title="HoverCard" detail="preview on hover/focus" height={170}>
            <HoverCard open={forced}>
              <HoverCardTrigger asChild>
                <span tabIndex={0}>
                  Reviewed by{" "}
                  <a
                    href="https://github.com/mroiban"
                    style={{ color: "var(--onyx-text-link)" }}
                  >
                    @mroiban
                  </a>
                </span>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                sideOffset={8}
                style={{ maxWidth: "min(280px,calc(100vw - 70px))" }}
              >
                <div className="row">
                  <Avatar size="lg">
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <strong>Marius Roiban</strong>
                    <div
                      style={{
                        fontSize: "var(--onyx-text-sm)",
                        color: "var(--onyx-text-description)",
                      }}
                    >
                      Owner · 12 pebbles
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "var(--onyx-text-sm)",
                    color: "var(--onyx-text-muted)",
                  }}
                >
                  Maintains Babel and Bedrock.
                </div>
              </HoverCardContent>
            </HoverCard>
          </Cell>
          <Cell
            title="AlertDialog"
            detail="role=alertdialog · safe focus"
            height={220}
            note="Initial focus lands on the safe action; Escape cancels; outside click does nothing."
          >
            <ModalFrame kind="alert" open={showOpen} />
          </Cell>
          <Cell title="Sheet / Drawer" detail="side · bottom" height={220}>
            <ModalFrame kind="sheet" open={showOpen} />
          </Cell>
          <Cell title="Combobox" detail="typeahead · create" height={230}>
            <Combobox
              activeIndex={showOpen ? 0 : undefined}
              className={showOpen ? "w1-combobox" : undefined}
              label="Language"
              defaultValue="fr"
              defaultInputValue="fr"
              open={forced}
              options={[
                { value: "fr", label: "French", description: "fr" },
                {
                  value: "fr-CA",
                  label: "French (Canada)",
                  description: "fr-CA",
                },
                { value: "fy", label: "Frisian", description: "fy" },
                { value: "en", label: "English", description: "en" },
              ]}
              onCreate={() => {}}
              createOption={(query) => (
                <>
                  <Icon name="add" />
                  Add “{query}” as custom locale
                </>
              )}
            />
          </Cell>
          <Cell title="Menubar · NavigationMenu" height={250}>
            <Menubar value={showOpen ? "edit" : undefined}>
              {["File", "Edit", "View", "Help"].map((label) => (
                <MenubarMenu key={label} value={label.toLowerCase()}>
                  <MenubarTrigger>{label}</MenubarTrigger>
                  <MenubarContent
                    align="start"
                    style={{ minWidth: 180 }}
                    onCloseAutoFocus={noFocus}
                  >
                    {label === "Edit" ? (
                      <>
                        <MenubarItem>
                          Undo<MenubarShortcut>⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem
                          data-highlighted={showOpen ? "" : undefined}
                        >
                          Redo<MenubarShortcut>⇧⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>
                          Find<MenubarShortcut>⌘F</MenubarShortcut>
                        </MenubarItem>
                      </>
                    ) : (
                      <MenubarItem>
                        {label === "File"
                          ? "New file"
                          : label === "View"
                            ? "Explorer"
                            : "About Onyx"}
                      </MenubarItem>
                    )}
                  </MenubarContent>
                </MenubarMenu>
              ))}
            </Menubar>
            <NavigationMenu
              value={showOpen ? "products" : undefined}
              style={{
                marginTop: "calc(150px - var(--onyx-control-height-md))",
              }}
            >
              <NavigationMenuList>
                <NavigationMenuItem value="products">
                  <NavigationMenuTrigger>
                    Products <Icon name="chevron-down" size="xs" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink href="#bedrock">
                      <strong>Bedrock</strong>
                      <small>Personal cloud</small>
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#babel">
                      <strong>Babel</strong>
                      <small>Translation workbench</small>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#docs">Docs</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Cell>
        </div>
      </TooltipProvider>
    </section>
  );
}

export type SourceCategory = 'Distro & OS News' | 'Linux & Open Source' | 'Security & Infrastructure' | 'Development & Tech';

export interface RssSource {
  id: string;
  name: string;
  url: string;
  category: SourceCategory;
  website: string;
}

export const sources: RssSource[] = [
  // 1. Distro & OS News (8)
  { id: 'archlinux', name: 'Arch Linux News', url: 'https://archlinux.org/feeds/news/', category: 'Distro & OS News', website: 'https://archlinux.org' },
  { id: 'archlinux-planet', name: 'Arch Linux Planet', url: 'https://planet.archlinux.org/rss20.xml', category: 'Distro & OS News', website: 'https://planet.archlinux.org' },
  { id: 'distrowatch', name: 'DistroWatch', url: 'https://distrowatch.com/news/dw.xml', category: 'Distro & OS News', website: 'https://distrowatch.com' },
  { id: 'distrowatch-weekly', name: 'DistroWatch Weekly', url: 'https://distrowatch.com/weekly.xml', category: 'Distro & OS News', website: 'https://distrowatch.com' },
  { id: 'fosspost', name: 'FOSS Post', url: 'https://fosspost.org/feed/', category: 'Distro & OS News', website: 'https://fosspost.org' },
  { id: 'linuxmint', name: 'Linux Mint Blog', url: 'https://blog.linuxmint.com/feed/', category: 'Distro & OS News', website: 'https://blog.linuxmint.com' },
  { id: 'endeavouros', name: 'EndeavourOS', url: 'https://endeavouros.com/feed/', category: 'Distro & OS News', website: 'https://endeavouros.com' },
  { id: 'manjaro', name: 'Manjaro Linux', url: 'https://manjaro.org/feed/', category: 'Distro & OS News', website: 'https://manjaro.org' },

  // 2. Linux & Open Source (10)
  { id: 'phoronix', name: 'Phoronix', url: 'https://www.phoronix.com/rss.php', category: 'Linux & Open Source', website: 'https://www.phoronix.com' },
  { id: 'omgubuntu', name: 'OMG! Ubuntu!', url: 'https://www.omgubuntu.co.uk/feed', category: 'Linux & Open Source', website: 'https://www.omgubuntu.co.uk' },
  { id: 'linuxfoundation', name: 'Linux Foundation', url: 'https://www.linuxfoundation.org/feed', category: 'Linux & Open Source', website: 'https://www.linuxfoundation.org' },
  { id: 'gnome', name: 'GNOME News', url: 'https://gitlab.gnome.org/GNOME/gnome-software/commits/main.atom', category: 'Linux & Open Source', website: 'https://www.gnome.org' },
  { id: 'kde', name: 'KDE News', url: 'https://kde.org/announcements/feed.xml', category: 'Linux & Open Source', website: 'https://kde.org' },
  { id: 'freedesktop', name: 'FreeDesktop.org', url: 'https://www.freedesktop.org/software/fontconfig/release/feed.xml', category: 'Linux & Open Source', website: 'https://www.freedesktop.org' },
  { id: 'opensuse', name: 'openSUSE News', url: 'https://news.opensuse.org/feed/', category: 'Linux & Open Source', website: 'https://news.opensuse.org' },
  { id: 'fedora', name: 'Fedora Magazine', url: 'https://fedoramagazine.org/feed/', category: 'Linux & Open Source', website: 'https://fedoramagazine.org' },
  { id: 'debian', name: 'Debian News', url: 'https://www.debian.org/News/news.rss', category: 'Linux & Open Source', website: 'https://www.debian.org' },
  { id: 'fsf', name: 'Free Software Foundation', url: 'https://www.fsf.org/blogs/community/feed', category: 'Linux & Open Source', website: 'https://www.fsf.org' },

  // 3. Security & Infrastructure (8)
  { id: 'archlinux-security', name: 'Arch Linux Security', url: 'https://security.archlinux.org/feed.xml', category: 'Security & Infrastructure', website: 'https://security.archlinux.org' },
  { id: 'cve', name: 'CVE Latest', url: 'https://cve.circl.lu/feeds/latest', category: 'Security & Infrastructure', website: 'https://cve.circl.lu' },
  { id: 'thehackernews', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', category: 'Security & Infrastructure', website: 'https://thehackernews.com' },
  { id: 'bleepingcomputer', name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', category: 'Security & Infrastructure', website: 'https://www.bleepingcomputer.com' },
  { id: 'cloudflare', name: 'Cloudflare Blog', url: 'https://blog.cloudflare.com/rss/', category: 'Security & Infrastructure', website: 'https://blog.cloudflare.com' },
  { id: 'github-blog', name: 'GitHub Blog', url: 'https://github.blog/feed/', category: 'Security & Infrastructure', website: 'https://github.blog' },
  { id: 'gitlab-blog', name: 'GitLab Blog', url: 'https://about.gitlab.com/atom.xml', category: 'Security & Infrastructure', website: 'https://about.gitlab.com' },
  { id: 'nixos', name: 'NixOS News', url: 'https://nixos.org/feeds/news.xml', category: 'Security & Infrastructure', website: 'https://nixos.org' },

  // 4. Development & Tech (8)
  { id: 'hackernews', name: 'Hacker News', url: 'https://hnrss.org/frontpage', category: 'Development & Tech', website: 'https://news.ycombinator.com' },
  { id: 'lwn', name: 'LWN.net', url: 'https://lwn.net/headlines/newrss', category: 'Development & Tech', website: 'https://lwn.net' },
  { id: 'arstechnica', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Development & Tech', website: 'https://arstechnica.com' },
  { id: 'servethehome', name: 'ServeTheHome', url: 'https://www.servethehome.com/feed/', category: 'Development & Tech', website: 'https://www.servethehome.com' },
  { id: 'devto', name: 'DEV Community', url: 'https://dev.to/feed', category: 'Development & Tech', website: 'https://dev.to' },
  { id: 'stackoverflow', name: 'Stack Overflow Blog', url: 'https://stackoverflow.blog/feed/', category: 'Development & Tech', website: 'https://stackoverflow.blog' },
  { id: 'nginx', name: 'NGINX Blog', url: 'https://www.nginx.com/blog/feed/', category: 'Development & Tech', website: 'https://www.nginx.com' },
  { id: 'docker', name: 'Docker Blog', url: 'https://www.docker.com/blog/feed/', category: 'Development & Tech', website: 'https://www.docker.com' }
];

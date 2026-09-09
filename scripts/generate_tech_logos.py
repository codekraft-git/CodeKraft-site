import os

svgs = {
    'nextjs_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none">
  <circle cx="25" cy="25" r="19" fill="#080c10" stroke="#304154" stroke-width="1.5"/>
  <path d="M19 16V34M31 16L22.5 28.5" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M22 27.5L31 34" stroke="url(#nextGrad)" stroke-width="2.4" stroke-linecap="round"/>
  <defs>
    <linearGradient id="nextGrad" x1="22" y1="27.5" x2="31" y2="34" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <text x="56" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">Next.js</text>
</svg>''',

    'react_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 50" fill="none">
  <g transform="translate(25, 25)">
    <circle cx="0" cy="0" r="4.2" fill="#58c4dc"/>
    <ellipse rx="18" ry="7" fill="none" stroke="#58c4dc" stroke-width="1.8"/>
    <ellipse rx="18" ry="7" transform="rotate(60)" fill="none" stroke="#58c4dc" stroke-width="1.8"/>
    <ellipse rx="18" ry="7" transform="rotate(120)" fill="none" stroke="#58c4dc" stroke-width="1.8"/>
  </g>
  <text x="56" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">React</text>
</svg>''',

    'typescript_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 195 50" fill="none">
  <rect x="6" y="7" width="36" height="36" rx="8" fill="#3178C6" stroke="#4a95ea" stroke-width="1"/>
  <path d="M14 18h14m-7 0v15" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M36 21c-1-1.5-2.8-2-4.5-2-2.5 0-4.2 1.4-4.2 3.3 0 3.7 7.2 2.6 7.2 6.7 0 2.4-2 4-5 4-2.5 0-4.5-1-5.5-2.5" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  <text x="56" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">TypeScript</text>
</svg>''',

    'python_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175 50" fill="none">
  <g transform="translate(8, 7) scale(0.72)">
    <path d="M24 2C13 2 13.8 6.7 13.8 6.7L13.8 11.7L24.4 11.7L24.4 13.3L8.8 13.3C8.8 13.3 2 12.5 2 23.5C2 34.5 7.8 34.1 7.8 34.1L12.5 34.1L12.5 28.5C12.5 22.3 17.8 22.3 17.8 22.3L28.3 22.3C34.2 22.3 34.2 16.5 34.2 16.5L34.2 7.7C34.2 7.7 35.1 2 24 2ZM18.8 6.2C20.2 6.2 21.3 7.3 21.3 8.7C21.3 10.1 20.2 11.2 18.8 11.2C17.4 11.2 16.3 10.1 16.3 8.7C16.3 7.3 17.4 6.2 18.8 6.2Z" fill="#387EB8"/>
    <path d="M25.6 47C36.6 47 35.8 42.3 35.8 42.3L35.8 37.3L25.2 37.3L25.2 35.7L40.8 35.7C40.8 35.7 47.6 36.5 47.6 25.5C47.6 14.5 41.8 14.9 41.8 14.9L37.1 14.9L37.1 20.5C37.1 26.7 31.8 26.7 31.8 26.7L21.3 26.7C15.4 26.7 15.4 32.5 15.4 32.5L15.4 41.3C15.4 41.3 14.5 47 25.6 47ZM30.8 42.8C29.4 42.8 28.3 41.7 28.3 40.3C28.3 38.9 29.4 37.8 30.8 37.8C32.2 37.8 33.3 38.9 33.3 40.3C33.3 41.7 32.2 42.8 30.8 42.8Z" fill="#FFE052"/>
  </g>
  <text x="54" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">Python</text>
</svg>''',

    'postgresql_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 195 50" fill="none">
  <g transform="translate(8, 7) scale(0.74)">
    <path d="M26 3C18 3 11.5 8 9.5 15C8 14.5 6 15 5 17C3.5 20 4.5 23 5.5 25C4 28 4.5 32 6.5 35C5.5 38 7 42 10.5 43.5C12 44.5 14 44.5 15.5 43.5C17 45.5 20.5 46.5 23 45.5C24.5 45 25 43.5 25.5 41.5C27 42 29 42 30.5 41.5C33.5 40 34.5 37 35 34C38.5 34.5 42 32 43.5 28C45.5 23 44 17 40.5 13C37 9 32 3 26 3Z" fill="#336791" stroke="#5ca2d6" stroke-width="1.4"/>
    <circle cx="21" cy="18" r="2.2" fill="#FFFFFF"/>
  </g>
  <text x="54" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="19" font-weight="600" letter-spacing="-0.02em">PostgreSQL</text>
</svg>''',

    'docker_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175 50" fill="none">
  <g transform="translate(6, 9) scale(0.72)">
    <rect x="18" y="10" width="5.5" height="5.5" rx="0.8" fill="#2496ED"/>
    <rect x="25" y="10" width="5.5" height="5.5" rx="0.8" fill="#2496ED"/>
    <rect x="25" y="3.5" width="5.5" height="5.5" rx="0.8" fill="#2496ED"/>
    <rect x="11" y="17" width="5.5" height="5.5" rx="0.8" fill="#2496ED"/>
    <rect x="18" y="17" width="5.5" height="5.5" rx="0.8" fill="#2496ED"/>
    <rect x="25" y="17" width="5.5" height="5.5" rx="0.8" fill="#2496ED"/>
    <rect x="32" y="17" width="5.5" height="5.5" rx="0.8" fill="#2496ED"/>
    <path d="M47 21C45 20.5 42.5 21.5 41.5 22.5C39 20 35 20 35 20C35 20 28 20 10 20C4 20 1 25 1 28C1 35 7 40 18 40C30 40 40 37 44 29C48 29 50 26 50 24C49 23 48 22 47 21Z" fill="#2496ED"/>
    <circle cx="10" cy="27" r="1.5" fill="#080e14"/>
  </g>
  <text x="54" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">Docker</text>
</svg>''',

    'aws_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175 50" fill="none">
  <g transform="translate(8, 10) scale(0.78)">
    <path d="M12 4L5 25h4l1.5-5h7l1.5 5h4L16 4h-4zm2 4.5l2.5 8.5h-5L14 8.5z" fill="#FFFFFF"/>
    <path d="M26 4l-4 21h3.5l2.5-13.5 3 13.5h3.5l3-13.5 2.5 13.5H43L39 4h-4l-2.5 12.5L30 4h-4z" fill="#FFFFFF"/>
    <path d="M47 19c2 1.5 4.5 2.2 7 2.2 3.5 0 5-1.5 5-3.5 0-4-10-2-10-8.5 0-3.5 2.8-5.5 7.5-5.5 2.5 0 4.8.8 6.5 1.8l-1.5 3c-1.5-.8-3.2-1.5-5-1.5-2.2 0-3.5 1-3.5 2.2 0 3.8 10 1.8 10 8.5 0 4-3 6-8 6-3 0-5.8-1-7.8-2.2l1.3-3z" fill="#FFFFFF"/>
    <path d="M4 31C18 39 36 39 49 32" stroke="#FF9900" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M46 29L51 32L46 35" fill="#FF9900"/>
  </g>
  <text x="62" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">AWS Cloud</text>
</svg>''',

    'nodejs_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175 50" fill="none">
  <g transform="translate(8, 7) scale(0.72)">
    <path d="M24 3L44 14.5V37.5L24 49L4 37.5V14.5L24 3Z" fill="#339933" stroke="#52b652" stroke-width="1.5"/>
    <path d="M16 28V19L24 23.5V33L16 28Z" fill="#FFFFFF"/>
    <path d="M24 23.5L32 19V28L24 33V23.5Z" fill="#E6E6E6"/>
    <path d="M16 19L24 14.5L32 19L24 23.5L16 19Z" fill="#FFFFFF" fill-opacity="0.8"/>
  </g>
  <text x="54" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">Node.js</text>
</svg>''',

    'kubernetes_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 205 50" fill="none">
  <g transform="translate(8, 7) scale(0.74)">
    <circle cx="24" cy="24" r="22" fill="#326CE5" fill-opacity="0.15" stroke="#326CE5" stroke-width="1.5"/>
    <path d="M24 6V14M24 34V42M8 16L15 20M33 28L40 32M8 32L15 28M33 20L40 16" stroke="#326CE5" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="8" fill="#326CE5" stroke="#FFFFFF" stroke-width="2"/>
  </g>
  <text x="56" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="19" font-weight="600" letter-spacing="-0.02em">Kubernetes</text>
</svg>''',

    'redis_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" fill="none">
  <g transform="translate(8, 7) scale(0.72)">
    <path d="M24 4L42 13L24 22L6 13L24 4Z" fill="#D82C20"/>
    <path d="M6 13V24L24 33V22L6 13Z" fill="#A3241A"/>
    <path d="M42 13V24L24 33V22L42 13Z" fill="#C0281D"/>
    <path d="M6 26V37L24 46V35L6 26Z" fill="#A3241A"/>
    <path d="M42 26V37L24 46V35L42 26Z" fill="#C0281D"/>
    <circle cx="24" cy="13" r="2.5" fill="#FFFFFF"/>
  </g>
  <text x="52" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">Redis</text>
</svg>''',

    'cloudflare_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 50" fill="none">
  <g transform="translate(6, 9) scale(0.72)">
    <path d="M38 27C37.5 21 32 16.5 25.5 17C24.5 17 23.5 17.5 22.5 18C20.5 13 15.5 9.5 9.5 10C3.5 10.5 -1 15 -1 21C-1 21.5 -1 22 -0.8 22.5C-3.5 24 -5 27 -5 30C-5 34.5 -1.5 38 3 38H37C41 38 44 35 44 31C44 28 41.5 25.5 38 25V27Z" fill="#F38020"/>
    <path d="M38 27H19C18 27 17 26 17 25C17 24 18 23 19 23H38C39 23 40 24 40 25C40 26 39 27 38 27Z" fill="#FAAE40"/>
  </g>
  <text x="56" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="19" font-weight="600" letter-spacing="-0.02em">Cloudflare</text>
</svg>''',

    'cybersecurity_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 215 50" fill="none">
  <g transform="translate(8, 7) scale(0.74)">
    <path d="M24 4L7 11V22C7 33 14 43 24 46C34 43 41 33 41 22V11L24 4Z" fill="#0e2238" stroke="#90c7ff" stroke-width="2"/>
    <path d="M18 24L23 29L30 18" stroke="#90c7ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="54" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="19" font-weight="600" letter-spacing="-0.02em">Cybersecurity</text>
</svg>''',

    'figma_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" fill="none">
  <g transform="translate(12, 7) scale(0.72)">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22H22V2H12Z" fill="#F24E1E"/>
    <path d="M22 2H32C37.5 2 42 6.5 42 12C42 17.5 37.5 22 32 22H22V2Z" fill="#FF7262"/>
    <path d="M22 22H32C37.5 22 42 26.5 42 32C42 37.5 37.5 42 32 42C26.5 42 22 37.5 22 32V22Z" fill="#1ABCFE"/>
    <path d="M2 32C2 26.5 6.5 22 12 22H22V42H12C6.5 42 2 37.5 2 32Z" fill="#0ACF83"/>
    <path d="M2 42C2 47.5 6.5 52 12 52C17.5 52 22 47.5 22 42V32H12C6.5 32 2 36.5 2 42Z" fill="#A259FF"/>
  </g>
  <text x="54" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.02em">Figma</text>
</svg>''',

    'graphql_logo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" fill="none">
  <g transform="translate(8, 7) scale(0.74)">
    <polygon points="24,4 43,14 43,36 24,46 5,36 5,14" fill="none" stroke="#E10098" stroke-width="1.8"/>
    <polygon points="24,10 38,33 10,33" fill="none" stroke="#E10098" stroke-width="1.8"/>
    <circle cx="24" cy="4" r="3" fill="#E10098"/>
    <circle cx="43" cy="14" r="3" fill="#E10098"/>
    <circle cx="43" cy="36" r="3" fill="#E10098"/>
    <circle cx="24" cy="46" r="3" fill="#E10098"/>
    <circle cx="5" cy="36" r="3" fill="#E10098"/>
    <circle cx="5" cy="14" r="3" fill="#E10098"/>
  </g>
  <text x="54" y="32" fill="#F0F6FC" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="19" font-weight="600" letter-spacing="-0.02em">GraphQL</text>
</svg>'''
}

dest_dir = 'public'
for name, content in svgs.items():
    dest = os.path.join(dest_dir, name)
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f'Successfully generated {dest}')

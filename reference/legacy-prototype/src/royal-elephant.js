export function createRoyalElephant(side) {
  const id = `royal-${side}`;

  return `
    <svg class="royal-elephant-art" viewBox="0 0 280 260" role="presentation" focusable="false">
      <defs>
        <linearGradient id="${id}-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fffaf0" />
          <stop offset="0.58" stop-color="#eee3cd" />
          <stop offset="1" stop-color="#d7c5a6" />
        </linearGradient>
        <linearGradient id="${id}-ear" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#eadbc4" />
          <stop offset="1" stop-color="#cbb596" />
        </linearGradient>
        <linearGradient id="${id}-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#b4786d" />
          <stop offset="1" stop-color="#8f544f" />
        </linearGradient>
        <pattern id="${id}-paisley" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M12 4 C18 7 18 15 12 19 C7 16 6 11 10 8 C13 7 15 10 13 12" fill="none" stroke="#ead18a" stroke-width="1.15" />
          <circle cx="4" cy="5" r="1.15" fill="#ead18a" />
          <circle cx="20" cy="19" r="1.15" fill="#ead18a" />
        </pattern>
        <filter id="${id}-shadow" x="-25%" y="-25%" width="150%" height="165%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#5d421f" flood-opacity=".14" />
        </filter>
      </defs>

      <ellipse class="elephant-ground-shadow" cx="136" cy="241" rx="103" ry="9" />

      <g class="elephant-body-group" filter="url(#${id}-shadow)">
        <path class="elephant-body" fill="url(#${id}-skin)" d="M35 109 C44 73 82 55 129 61 C166 65 187 84 193 113 C198 139 187 167 164 180 C136 196 78 190 49 169 C28 154 25 130 35 109Z" />
        <path class="elephant-back-line" d="M47 101 C79 71 133 67 175 93" />
        <path class="elephant-belly-line" d="M63 166 C92 177 131 178 159 164" />

        <g class="elephant-legs elephant-legs--rear">
          <path class="elephant-leg" fill="url(#${id}-skin)" d="M48 147 C58 148 67 151 74 159 L70 222 C63 230 48 229 42 220 L45 165Z" />
          <path class="elephant-leg" fill="url(#${id}-skin)" d="M130 164 C141 162 151 162 159 168 L164 222 C157 231 142 231 135 222Z" />
        </g>
        <g class="elephant-legs elephant-legs--front">
          <path class="elephant-leg" fill="url(#${id}-skin)" d="M82 160 C93 160 103 163 109 169 L106 226 C99 234 84 233 77 225 L78 173Z" />
          <path class="elephant-leg" fill="url(#${id}-skin)" d="M160 150 C172 148 182 151 188 159 L188 222 C181 231 166 231 159 222 L157 169Z" />
        </g>
        <path class="elephant-foot-detail" d="M43 218 Q57 211 70 219 M77 223 Q92 216 106 224 M135 220 Q150 214 164 220 M159 219 Q174 212 188 220" />
        <path class="elephant-skin-fold" d="M56 153 Q61 165 58 181 M91 166 Q96 177 92 190 M171 157 Q176 169 172 183" />

        <path class="elephant-tail" d="M37 119 C19 129 18 153 29 168" />
        <path class="elephant-tail-tuft" d="M24 164 Q28 178 36 168 Q29 174 23 168" />

        <g class="elephant-head-group">
          <path class="elephant-neck" fill="url(#${id}-skin)" d="M159 91 C173 75 195 70 215 79 L220 143 C205 163 177 166 159 148Z" />
          <path class="elephant-head" fill="url(#${id}-skin)" d="M177 76 C191 61 216 61 232 75 C245 87 246 109 238 128 C230 146 211 155 191 147 C174 140 166 120 169 99 C170 89 173 82 177 76Z" />
          <g class="elephant-ear">
            <path fill="url(#${id}-ear)" d="M184 88 C160 84 146 98 151 123 C155 145 177 156 194 139 C204 128 202 104 184 88Z" />
            <path class="ear-inner" d="M181 96 C164 96 158 108 161 122 C164 136 176 142 186 134" />
            <path class="ear-vein" d="M177 100 Q170 116 179 132" />
          </g>
          <path class="elephant-brow" d="M214 91 Q223 87 230 92" />
          <ellipse class="elephant-eye" cx="224" cy="98" rx="2.6" ry="2.2" />
          <circle class="elephant-eye-glint" cx="224.8" cy="97.2" r=".7" />
          <path class="elephant-cheek" d="M222 111 Q229 114 232 120" />
          <path class="elephant-tusk" d="M229 126 C246 135 255 127 258 117 C258 137 243 148 226 139Z" />
        </g>

        <g class="elephant-trunk-system">
          <path
            class="trunk-shape trunk-morph"
            fill="url(#${id}-skin)"
            d="M207 122 C218 116 229 120 234 131 C241 148 232 164 225 178 C219 191 219 208 230 220 C236 226 244 224 248 216 C252 225 249 239 238 245 C223 252 209 242 204 230 C197 213 200 195 207 179 C215 161 220 147 214 136 C211 130 207 127 203 126 C199 125 196 124 194 123 C198 120 203 120 207 122 C207 122 207 122 207 122 Z"
            data-rest="M207 122 C218 116 229 120 234 131 C241 148 232 164 225 178 C219 191 219 208 230 220 C236 226 244 224 248 216 C252 225 249 239 238 245 C223 252 209 242 204 230 C197 213 200 195 207 179 C215 161 220 147 214 136 C211 130 207 127 203 126 C199 125 196 124 194 123 C198 120 203 120 207 122 C207 122 207 122 207 122 Z"
            data-raised="M207 122 C218 116 229 120 234 131 C239 143 232 154 221 157 C207 161 194 151 191 137 C188 122 194 107 203 96 C213 84 218 69 212 57 C207 47 196 47 190 54 C184 62 188 71 196 72 C189 80 176 77 170 67 C163 55 168 40 181 32 C198 22 220 30 229 47 C240 68 229 91 219 105 C214 112 211 118 207 122 Z"
          />
          <path class="trunk-contour trunk-detail trunk-detail--rest" d="M225 132 C231 149 223 164 216 180 C209 197 211 218 225 231" />
          <path class="trunk-wrinkle trunk-detail trunk-detail--rest" d="M207 151 Q220 156 231 151 M204 166 Q216 172 226 168 M204 185 Q214 190 221 188 M208 207 Q219 210 228 205" />
          <path class="trunk-contour trunk-detail trunk-detail--raised" d="M225 132 C229 143 221 149 211 148 C200 146 198 134 200 122 C203 105 218 93 220 73 C222 54 211 39 195 38" />
          <path class="trunk-wrinkle trunk-detail trunk-detail--raised" d="M196 121 Q207 126 218 121 M197 106 Q207 111 216 107 M204 90 Q212 94 219 91 M211 73 Q218 76 224 73" />
          <ellipse class="trunk-nostril" cx="238" cy="237" rx="2.2" ry="1.35" />
          <circle class="trunk-tip-marker" cx="238" cy="237" r="2" />
        </g>

        <g class="elephant-regalia">
          <path class="saddle-underlay" d="M61 78 C89 60 139 61 170 82 L165 153 C131 168 91 165 59 146Z" />
          <path class="saddle-cloth" fill="url(#${id}-cloth)" d="M66 75 C96 62 135 63 163 80 L160 145 C131 158 93 157 63 143Z" />
          <path class="saddle-pattern" fill="url(#${id}-paisley)" d="M72 83 C96 72 132 72 155 84 L153 136 C129 147 96 147 70 136Z" />
          <path class="saddle-border" d="M64 128 Q111 146 160 128 M71 85 Q112 69 155 87" />
          <path class="saddle-fringe" d="M70 138 l7 10 7-8 7 11 8-9 8 11 8-10 8 9 8-10 8 8 7-11" />
          <circle class="regalia-gem" cx="88" cy="90" r="3" /><circle class="regalia-gem" cx="112" cy="84" r="3" /><circle class="regalia-gem" cx="137" cy="91" r="3" />

          <path class="headpiece" d="M181 80 C191 67 218 64 234 79 L230 96 C215 87 197 88 183 98Z" />
          <path class="headpiece-detail" d="M186 82 Q207 72 229 81 M193 88 Q208 80 224 87" />
          <circle class="regalia-gem" cx="207" cy="73" r="3.4" />
          <path class="forehead-chain" d="M184 96 Q207 110 235 97" />
          <circle class="regalia-drop" cx="193" cy="101" r="2.3" /><circle class="regalia-drop" cx="207" cy="106" r="2.3" /><circle class="regalia-drop" cx="222" cy="102" r="2.3" />

          <g class="howdah">
            <path class="howdah-seat" d="M86 65 L92 43 H142 L149 66Z" />
            <path class="howdah-canopy" d="M85 41 Q116 9 149 41Z" />
            <path class="howdah-finial" d="M116 14 v-8 M111 7 Q116 0 121 7Z" />
            <path class="howdah-columns" d="M94 42 V64 M140 42 V64 M106 38 V64 M128 38 V64" />
            <path class="howdah-trim" d="M86 42 H149 M84 66 H151" />
          </g>
        </g>
      </g>
    </svg>`;
}

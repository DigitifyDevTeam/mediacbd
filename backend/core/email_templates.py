"""
MediaCBD — templates e-mail commerciaux + règles IA.

Variables extraites des échanges type TribuneCBD (prospection → facture → publication).
Tarifs uniquement dans les e-mails (jamais sur le site public).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


# ---------------------------------------------------------------------------
# Catalogue des variables (à injecter depuis Prospect / Lead / settings)
# ---------------------------------------------------------------------------

VARIABLES: dict[str, str] = {
    # Prospect / boutique
    "brand_name": "Nom commercial de la boutique (ex. Origine CBD)",
    "contact_name": "Nom du contact / gérant",
    "email": "E-mail du destinataire",
    "address": "Adresse complète de la boutique",
    "city": "Ville",
    "postal_code": "Code postal",
    "phone": "Téléphone public",
    "website": "URL du site (avec https)",
    "opening_hours": "Horaires d'ouverture",
    "presentation": "Courte présentation activité",
    # Offre / facturation (e-mail seulement)
    "price_ht": "Tarif HT fiche (ex. 30)",
    "price_ttc": "Tarif TTC fiche (ex. 36)",
    "price_dofollow_ttc": "Tarif TTC fiche + lien dofollow (ex. 50)",
    "price_article_ttc": "Tarif TTC article dédié (ex. 80)",
    "currency": "Devise (ex. €)",
    "invoice_ref": "Référence facture (ex. MCBD-2026-001)",
    "payment_method": "Mode de règlement (ex. virement bancaire)",
    # Publication
    "directory_url": "URL annuaire MediaCBD",
    "listing_url": "URL de la fiche publiée",
    "dofollow_note": "Phrase courte si dofollow (sinon chaîne vide)",
    # Média / éditeur (signature)
    "media_name": "MediaCBD",
    "media_url": "https://mediacbd.fr",
    "media_tagline": "Accroche courte du média",
    "commercial_email": "E-mail commercial (ex. commercial@mediacbd.fr)",
    "editor_legal_name": "Raison sociale éditeur",
    "editor_siren": "SIREN éditeur",
    "editor_address": "Adresse siège éditeur",
    "editor_footer": "Ligne signature légale complète (pré-assemblée)",
    # Meta
    "missing_fields": "Liste des champs manquants (relance)",
    "sender_name": "Nom affiché expéditeur (ex. L'équipe MediaCBD)",
}


# ---------------------------------------------------------------------------
# Règles IA (system prompt / policy gate)
# ---------------------------------------------------------------------------

AI_RULES = """
Tu rédiges des e-mails pour MediaCBD (média CBD France–Europe).

RÈGLES STRICTES :
1. Utilise UNIQUEMENT les variables fournies. N'invente jamais : SIRET, IBAN, tarif, adresse, nom.
2. Ne garantis jamais de trafic, de ranking SEO, ni de résultat commercial chiffré.
3. Ne présente jamais la fiche comme une recommandation éditoriale ou un classement de boutiques.
4. Les tarifs apparaissent UNIQUEMENT dans l'e-mail (pas de renvoi « voir le prix sur le site »).
5. Ton : professionnel, clair, francophone, sans emojis marketing, sans pression agressive.
6. Toujours proposer STOP / désinscription sur les e-mails de prospection outbound.
7. Respecte le type de template demandé (prospect, facture, publié…). Ne change pas de scénario.
8. Si une variable critique manque (brand_name, address, email), signale-le au lieu d'inventer.
9. Signature : media_name, media_url, commercial_email, mentions légales éditeur si fournies.
10. Longueur : e-mail prospect ~180–280 mots ; e-mails tunnel plus courts.
11. Tu peux reformuler légèrement le corps pour le rendre naturel, sans ajouter de faits ni de chiffres.
""".strip()


@dataclass(frozen=True)
class EmailTemplate:
    key: str
    name: str
    subject: str
    body: str
    required: tuple[str, ...]
    optional: tuple[str, ...] = ()
    ai_hint: str = ""


def render(template: EmailTemplate, context: dict[str, Any]) -> tuple[str, str]:
    """Remplace {{var}} ; lève KeyError si une variable required manque."""
    missing = [k for k in template.required if not str(context.get(k, "")).strip()]
    if missing:
        raise KeyError(f"Variables manquantes pour [{template.key}]: {', '.join(missing)}")

    def repl(text: str) -> str:
        out = text
        for key, value in context.items():
            out = out.replace("{{" + key + "}}", str(value))
        # Nettoyage éventuel de placeholders non fournis (optionnels)
        for key in VARIABLES:
            out = out.replace("{{" + key + "}}", "")
        return out

    return repl(template.subject), repl(template.body)


# ---------------------------------------------------------------------------
# Templates (alignés sur le parcours Tribune observé)
# ---------------------------------------------------------------------------

TEMPLATES: dict[str, EmailTemplate] = {}


def _t(tpl: EmailTemplate) -> EmailTemplate:
    TEMPLATES[tpl.key] = tpl
    return tpl


# 1) OUTBOUND — prospection (comme le mail Tribune collé)
_t(
    EmailTemplate(
        key="prospect_outreach",
        name="Prospection outbound — proposition de fiche",
        subject="Référencement {{brand_name}} sur la carte MediaCBD",
        required=(
            "brand_name",
            "address",
            "directory_url",
            "media_name",
            "media_url",
            "commercial_email",
            "price_ht",
            "price_ttc",
            "currency",
            "sender_name",
            "editor_footer",
        ),
        optional=("city", "media_tagline"),
        ai_hint=(
            "Premier contact froid. Personnaliser avec brand_name + address. "
            "Inclure STOP. Pas de dofollow ici."
        ),
        body="""Bonjour,

Je vous contacte au nom de {{media_name}}, un média francophone consacré au CBD, au chanvre et à leur actualité réglementaire en France et en Europe.

Votre présence publique identifie la boutique {{brand_name}} ({{address}}) : l'annuaire MediaCBD peut renforcer cette visibilité locale auprès de lecteurs qui cherchent un acteur de proximité.

Nous développons une carte de France des boutiques CBD :
{{directory_url}}

Nous vous proposons d'y référencer {{brand_name}} avec une fiche permanente comprenant vos coordonnées, votre site, votre localisation et une présentation de votre activité.

Tarif unique : {{price_ht}} {{currency}} HT, soit {{price_ttc}} {{currency}} TTC.
Il ne s'agit pas d'un abonnement et aucun renouvellement ne sera facturé. Cette présence vise à améliorer votre visibilité et à permettre aux lecteurs de vous trouver plus facilement, sans garantie chiffrée de trafic.

Si l'offre vous intéresse, répondez simplement à ce message. Nous vous demanderons alors les informations de la fiche et de facturation. Le règlement s'effectue par virement, et la fiche est publiée après encaissement.

Bien cordialement,

{{sender_name}}
{{media_url}}
{{commercial_email}}

{{editor_footer}}

Si vous ne souhaitez plus recevoir de proposition de notre part, répondez « STOP » et nous n'écrirons plus.
""".strip(),
    )
)

# 2) Après intérêt — demander le dossier (comme Tribune après le 1er oui)
_t(
    EmailTemplate(
        key="ask_billing_pack",
        name="Demande dossier fiche + facturation",
        subject="{{media_name}} — suite référencement {{brand_name}}",
        required=(
            "brand_name",
            "media_name",
            "sender_name",
            "commercial_email",
            "media_url",
            "price_dofollow_ttc",
            "price_article_ttc",
            "currency",
        ),
        optional=("directory_url",),
        ai_hint=(
            "Réponse chaude après intérêt. Lister clairement les pièces à fournir. "
            "Mentionner option article séparément."
        ),
        body="""Bonjour,

Merci pour votre message et pour votre intérêt pour {{media_name}}.

Après validation, nous pouvons proposer à {{brand_name}} une fiche professionnelle permanente sur l'annuaire MediaCBD, avec intégration d'un lien en dofollow, au tarif de {{price_dofollow_ttc}} {{currency}} TTC, par virement bancaire. La publication et l'intégration du lien interviendront uniquement après confirmation effective de l'encaissement.

Si vous souhaitez également un article dédié, cette prestation est proposée séparément au tarif de {{price_article_ttc}} {{currency}} TTC.

Pour préparer la commande et la facturation, merci de nous transmettre uniquement les éléments suivants :

• raison sociale et nom commercial ;
• adresse de facturation ;
• SIREN/SIRET et numéro de TVA intracommunautaire, le cas échéant ;
• nom, fonction et adresse e-mail du contact de facturation ;
• adresse exacte de la boutique à afficher sur la fiche ;
• URL du site à associer à la fiche ;
• téléphone public, horaires et courte présentation ;
• logo ou photo autorisé(e) à la publication.

Merci également de nous indiquer si vous souhaitez uniquement la fiche avec lien dofollow, ou si vous souhaitez ajouter l'article dédié. À réception des informations complètes, nous vous adresserons la facture et les coordonnées de virement. Aucun volume de trafic ni résultat de référencement n'est garanti.

Bien cordialement,
{{sender_name}}
{{media_name}}
{{commercial_email}}
{{media_url}}
""".strip(),
    )
)

# 3) Accusé après formulaire Acteurs
_t(
    EmailTemplate(
        key="form_ack",
        name="Accusé réception formulaire Acteurs",
        subject="{{media_name}} — demande de référencement bien reçue",
        required=("brand_name", "contact_name", "media_name", "sender_name", "commercial_email"),
        optional=("directory_url",),
        ai_hint="Court, rassurant. Orienter vers la suite par e-mail.",
        body="""Bonjour {{contact_name}},

Nous avons bien reçu votre demande de référencement pour {{brand_name}} sur l'annuaire MediaCBD.

Notre équipe revient vers vous rapidement pour la suite (contrôle d'activité, éléments de fiche et modalités).

Bien cordialement,
{{sender_name}}
{{media_name}} — {{commercial_email}}
""".strip(),
    )
)

# 4) Relance champs manquants
_t(
    EmailTemplate(
        key="nudge_missing_fields",
        name="Relance — éléments manquants",
        subject="{{media_name}} — éléments manquants pour {{brand_name}}",
        required=("brand_name", "missing_fields", "sender_name", "media_name", "commercial_email"),
        ai_hint="Lister uniquement missing_fields. Ton factuel.",
        body="""Bonjour,

Pour finaliser le dossier de référencement de {{brand_name}}, il nous manque encore :

{{missing_fields}}

Dès réception de ces éléments, nous pourrons vous adresser la facture et les instructions de règlement.

Bien cordialement,
{{sender_name}}
{{media_name}} — {{commercial_email}}
""".strip(),
    )
)

# 5) Envoi facture (après pack complet)
_t(
    EmailTemplate(
        key="invoice_sent",
        name="Envoi facture",
        subject="Facture {{invoice_ref}} — fiche {{brand_name}}",
        required=(
            "brand_name",
            "invoice_ref",
            "price_dofollow_ttc",
            "currency",
            "payment_method",
            "sender_name",
            "media_name",
        ),
        optional=("commercial_email", "media_url"),
        ai_hint="Joindre la facture PDF côté envoi technique. Rappeler ref + montant + publication après encaissement.",
        body="""Bonjour,

Merci pour votre confirmation.

Vous trouverez ci-joint la facture {{invoice_ref}}, d'un montant de {{price_dofollow_ttc}} {{currency}} TTC, correspondant à la création de la fiche permanente {{brand_name}} avec intégration du lien dofollow.

Le règlement s'effectue par {{payment_method}} en indiquant impérativement la référence {{invoice_ref}}. Les coordonnées bancaires figurent sur la facture.

La fiche sera mise en ligne après confirmation effective de l'encaissement.

Bien cordialement,
{{sender_name}}
{{media_name}}
""".strip(),
    )
)

# 6) Relance paiement
_t(
    EmailTemplate(
        key="payment_reminder",
        name="Relance paiement",
        subject="Rappel — facture {{invoice_ref}} ({{brand_name}})",
        required=("brand_name", "invoice_ref", "price_dofollow_ttc", "currency", "sender_name", "media_name"),
        ai_hint="Une seule relance douce.",
        body="""Bonjour,

Sauf erreur de notre part, nous n'avons pas encore enregistré le règlement de la facture {{invoice_ref}} ({{price_dofollow_ttc}} {{currency}} TTC) relative à la fiche {{brand_name}}.

Dès confirmation de l'encaissement, nous procéderons à la publication.

Bien cordialement,
{{sender_name}}
{{media_name}}
""".strip(),
    )
)

# 7) Fiche publiée
_t(
    EmailTemplate(
        key="listing_published",
        name="Fiche publiée — demande de confirmation",
        subject="{{brand_name}} est en ligne sur {{media_name}}",
        required=(
            "brand_name",
            "directory_url",
            "listing_url",
            "website",
            "sender_name",
            "media_name",
            "dofollow_note",
        ),
        optional=("address", "phone", "opening_hours"),
        ai_hint="Confirmer ce qui est en ligne. Demander validation. Correction factuelle uniquement.",
        body="""Bonjour,

Le règlement a bien été confirmé et la fiche {{brand_name}} est désormais publiée dans l'annuaire {{media_name}} :

{{listing_url}}

(Annuaire : {{directory_url}})

La fiche comporte les éléments transmis (coordonnées, présentation) ainsi que le lien vers {{website}}{{dofollow_note}}. Elle est clairement identifiée comme fiche partenaire.

Pouvez-vous vérifier le rendu et nous confirmer par retour de mail que la fiche correspond bien à votre demande ? Si une information factuelle doit être corrigée, indiquez-nous précisément laquelle.

Bien cordialement,
{{sender_name}}
{{media_name}}
""".strip(),
    )
)

# 8) Confirmation STOP
_t(
    EmailTemplate(
        key="stop_confirm",
        name="Confirmation désinscription STOP",
        subject="{{media_name}} — demande STOP prise en compte",
        required=("media_name", "sender_name"),
        optional=("brand_name",),
        ai_hint="Court. Confirmer qu'aucun nouvel e-mail commercial ne sera envoyé.",
        body="""Bonjour,

Nous avons bien pris en compte votre demande. Vous ne recevrez plus de propositions commerciales de la part de {{media_name}}.

Bien cordialement,
{{sender_name}}
""".strip(),
    )
)

# 9) Refus / non éligible
_t(
    EmailTemplate(
        key="rejected_not_fit",
        name="Clôture — non éligible",
        subject="{{media_name}} — suite de votre demande",
        required=("brand_name", "media_name", "sender_name"),
        ai_hint="Poli, court, sans détail litigieux.",
        body="""Bonjour,

Merci pour votre intérêt pour {{media_name}}.

Après examen, nous ne sommes pas en mesure de donner suite à une fiche pour {{brand_name}} pour le moment.

Bien cordialement,
{{sender_name}}
{{media_name}}
""".strip(),
    )
)


def list_templates() -> list[dict[str, str]]:
    return [
        {
            "key": t.key,
            "name": t.name,
            "required": ", ".join(t.required),
            "optional": ", ".join(t.optional),
        }
        for t in TEMPLATES.values()
    ]


def build_ai_prompt(template_key: str, context: dict[str, Any]) -> str:
    """Prompt prêt pour Ollama / LLM : règles + template + variables."""
    tpl = TEMPLATES[template_key]
    subject, body = render(tpl, context)
    lines = [
        AI_RULES,
        "",
        f"TYPE DE MESSAGE : {tpl.key} — {tpl.name}",
        f"HINT : {tpl.ai_hint}" if tpl.ai_hint else "",
        "",
        "VARIABLES FOURNIES :",
    ]
    for k, v in sorted(context.items()):
        if str(v).strip():
            lines.append(f"- {k}: {v}")
    lines.extend(
        [
            "",
            "BROUILLON DE BASE (tu peux reformuler légèrement, sans inventer) :",
            f"Objet : {subject}",
            "",
            body,
            "",
            "Réponds uniquement avec :",
            "SUBJECT: ...",
            "BODY:",
            "...",
        ]
    )
    return "\n".join(line for line in lines if line is not None)

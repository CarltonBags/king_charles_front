
const match_drinks = `
    create or replace function match_drinks(
    query_embedding vector(1536),

    semantic_query text default null,
    drink_type text default null,
    is_alcoholic boolean default null,
    max_abv numeric default null,
    negative text[] default null,
    flavor_profile text[] default null,
    negative_categories text[] default null,

    match_count int default 5
)

returns table (
    metadata jsonb,
    similarity float
)

language sql

as $$

select
    metadata,
    1 - (embedding <=> query_embedding) as similarity

from drinks

where

    (
        drink_type is null
        or lower(metadata->>'category') = lower(drink_type)
    )

    and (
        is_alcoholic is null
        or (
            case
                when is_alcoholic = true
                    then (metadata->>'abv')::numeric > 0.5
                else
                    (metadata->>'abv')::numeric <= 0.5
            end
        )
    )

    and (
        max_abv is null
        or (metadata->>'abv')::numeric <= max_abv
    )

    and (
        flavor_profile is null
        or array_length(flavor_profile, 1) is null
        or exists (
            select 1
            from jsonb_array_elements_text(
                metadata->'taste_profile'->'primary_notes'
            ) as note
            where note = any(flavor_profile)
        )
    )

    and (
        negative is null
        or array_length(negative, 1) is null
        or not exists (
            select 1
            from jsonb_array_elements_text(
                metadata->'taste_profile'->'primary_notes'
            ) as note
            where note = any(negative)
        )
    )

    and (
        negative_categories is null
        or array_length(negative_categories, 1) is null
        or not (lower(metadata->>'category') = any(negative_categories))
    )

order by embedding <=> query_embedding

limit match_count;

$$;
`
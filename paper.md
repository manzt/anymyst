# Example of an any(widget) directive for myst

@fig1

the widget should appear below 👇
::::{figure}
:label: fig2
:::{any} https://manzt.github.io/anymyst/widgets/counter.js

{ "value": 42 }

:::
capiton
::::


# hi

::::{figure}
:label: fig1
:::{any} https://manzt.github.io/anymyst/widgets/viewer.js

{ "source": "https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.1/4495402.zarr" }

:::
capiton
::::

and above 👆🏻

@fig1